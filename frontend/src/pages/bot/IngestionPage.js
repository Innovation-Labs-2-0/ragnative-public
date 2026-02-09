import React, { useState, useEffect } from "react";
import { Grid, Avatar } from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDButton from "components/style-components/MDButton";
import MDProgress from "components/style-components/MDProgress";
import { postRequest, getRequest } from "utils/apiClient";
import MDSnackbar from "components/style-components/MDSnackbar";
import PropTypes from "prop-types";
import { useBotContext } from "context/BotContext";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";

function IngestBotPage({ onBack, onNext }) {
  const [progress, setProgress] = useState(0);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState("");
  const [botName, setBotName] = useState("BOT");
  const [botAvatar, setBotAvatar] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
    title: "",
    icon: "",
  });
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  const {
    chatbotId: botId,
    ingestionCompleted: completed,
    setIngestionComplete: setCompleted,
  } = useBotContext();
  const { kbId: knowledgeBaseId } = useKnowledgeBaseContext();
  const getbotInfo = async () => {
    try {
      const botInfo = await getRequest(`/bot/${botId}`);
      setBotName(botInfo.name);
      setBotAvatar(botInfo.avatar);
    } catch (err) {
      console.error("Failed to fetch bot info:", err);
    }
  };

  const fetchStatus = async (intervalId) => {
    if (!knowledgeBaseId) return;
    try {
      const data = await getRequest(`/ingestion/status/${knowledgeBaseId}`);

      const { ingestion_status, ingestion_percent, error_message } = data || {};
      setProgress(ingestion_percent);
      if (ingestion_status === "completed" || ingestion_status === "failed") {
        intervalId && clearInterval(intervalId);
        setIngesting(false);
        if (ingestion_status === "completed") {
          setCompleted(true);
        } else if (ingestion_status === "failed") {
          setError(error_message || "Ingestion failed. Please try again.");
          const pathRegex = /[a-zA-Z]:\\\\(?:[^\\\\]+\\\\)+/g;
          const cleaned_msg = error_message.replace(pathRegex, "");
          setSnackbar({
            open: true,
            message: cleaned_msg || "Ingestion failed. Please try again.",
            severity: "error",
            title: "Ingestion Failed!",
            icon: "home",
          });
        }
      } else if (ingestion_status === "in progress") {
        setIngesting(true);
      } else if (ingestion_status === "not started") {
        setIngesting(false);
        setCompleted(false);
      }
    } catch (err) {
      console.error("Error checking ingestion status:", err);
      intervalId && clearInterval(intervalId);
      setIngesting(false);
    }
  };

  const startIngestion = async () => {
    try {
      setError("");
      setProgress(0);
      setCompleted(false);
      setIngesting(true);

      await postRequest(`/ingestion/`, {
        kb_id: knowledgeBaseId,
      });
    } catch (err) {
      console.error("Error during ingestion:", err);
      setError("Failed to start ingestion process. Please try again.");
      setIngesting(false);
    }
  };

  const getStatusText = () => {
    if (completed) return "Ingestion complete!";
    if (ingesting && progress > 0) return "Processing knowledge sources...";
    if (error) return "Ingestion Failed!";
    if (ingesting) return "Starting ingestion...";
    return "Ready to ingest your bot’s knowledge base.";
  };

  useEffect(() => {
    getbotInfo();
    fetchStatus();
  }, []);

  useEffect(() => {
    let intervalId;
    if (ingesting) {
      intervalId = setInterval(() => {
        fetchStatus(intervalId);
      }, 1000);
    }
    return;
  }, [ingesting, fetchStatus]);
  return (
    <MDBox mt={2} p={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={2} display="flex" justifyContent="center">
          <Avatar
            src={botAvatar}
            alt={botName}
            sx={{
              width: 90,
              height: 90,
              border: "2px solid #1976d2",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          />
        </Grid>

        <Grid item xs={12} md={10}>
          <MDTypography variant="h5" fontWeight="medium">
            {botName || "Your Bot"}
          </MDTypography>

          <MDTypography variant="body2" color="text" sx={{ mt: 0.5 }}>
            {getStatusText()}
          </MDTypography>

          <MDBox mt={3}>
            <MDProgress
              variant="gradient"
              color={error ? "error" : completed ? "success" : "info"}
              value={progress}
              label
            />
            <MDTypography variant="caption" color="text">
              {error
                ? `Ingestion failed at ${progress}%.`
                : completed
                ? "Completed"
                : `${progress}% completed`}
            </MDTypography>
          </MDBox>

          <Grid item xs={12} mt={3}>
            <MDBox display="flex" justifyContent="flex-end" gap={2}>
              <MDButton variant="outlined" color="secondary" size="small" onClick={onBack}>
                Back
              </MDButton>

              {!completed ? (
                <MDButton
                  variant="contained"
                  color="primary"
                  onClick={startIngestion}
                  disabled={ingesting}
                  size="small"
                >
                  {ingesting ? "Ingesting..." : "Ingest"}
                </MDButton>
              ) : (
                progress === 100 && (
                  <MDButton variant="contained" color="success" onClick={onNext} size="small">
                    Test Bot
                  </MDButton>
                )
              )}
            </MDBox>
          </Grid>
        </Grid>
      </Grid>
      <MDSnackbar
        color={snackbar.severity}
        icon={snackbar.icon}
        title={snackbar.title}
        dateTime={new Date().toLocaleTimeString()}
        content={snackbar.message}
        open={snackbar.open}
        close={handleCloseSnackbar}
      />
    </MDBox>
  );
}

IngestBotPage.propTypes = {
  onBack: PropTypes.func,
  onNext: PropTypes.func,
};

export default IngestBotPage;
