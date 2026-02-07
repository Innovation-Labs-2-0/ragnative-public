import React, { useEffect, useState } from "react";
import { Grid, TextField, Avatar, Tooltip, CircularProgress, Fade, Divider } from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDButton from "components/style-components/MDButton";
import MDSnackbar from "components/style-components/MDSnackbar";
import { getRequest, postRequest } from "utils/apiClient";
import PropTypes from "prop-types";
import { useBotContext } from "context/BotContext";

function BotValidationPage({ onBack, onNext }) {
  const { chatbotId } = useBotContext();

  const [botDetails, setBotDetails] = useState({
    name: "",
    description: "",
    createdAt: "",
    avatar: "/assets/avatar_icons/avatar-1.png",
  });

  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState("");
  const [validated, setValidated] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getBotDetails = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`/bot/${chatbotId}`);

      if (response) {
        setBotDetails({
          name: response.name || "",
          description: response.description || "",
          avatar: response.avatar || "/assets/avatar_icons/avatar-1.png",
        });
      } else {
        setError("Bot details not found.");
      }
    } catch (err) {
      console.error("Error fetching bot details:", err);
      setError("Failed to load bot details.");
      setSnackbar({
        open: true,
        message: err,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    try {
      setValidating(true);
      setError("");
      const response = await postRequest(`/bot/validate/${chatbotId}`, {});

      if (response?.isValid === true || response?.validated === true) {
        setValidated(true);
        setSnackbar({
          open: true,
          message: "Bot validation successful!",
          severity: "success",
        });
      } else {
        const msg =
          response?.errors?.[0]?.message ||
          response?.message ||
          "Validation failed. Please check configuration.";
        setError(msg);
        setSnackbar({
          open: true,
          message: msg,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error validating bot:", err);
      setSnackbar({
        open: true,
        message: "Validation failed due to a server error.",
        severity: "error",
      });
      setError("Validation failed due to a server error.");
      setSnackbar({
        open: true,
        message: error,
        severity: "error",
      });
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    if (chatbotId) getBotDetails();
  }, [chatbotId]);

  return (
    <Fade in timeout={400}>
      <MDBox
        p={4}
        mt={2}
        borderRadius="xl"
        boxShadow="0 4px 18px rgba(0,0,0,0.08)"
        sx={{ backgroundColor: "white" }}
      >
        <MDTypography variant="h5" fontWeight="bold" mb={2} color="primary">
          Bot Validation
        </MDTypography>

        {loading ? (
          <MDBox display="flex" justifyContent="center" mt={6}>
            <CircularProgress size={40} />
          </MDBox>
        ) : (
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={2} display="flex" justifyContent="center">
              <Tooltip title="Bot Avatar">
                <Avatar
                  src={botDetails.avatar}
                  alt={botDetails.name}
                  sx={{
                    width: 100,
                    height: 100,
                    boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
                    border: "3px solid #1976d2",
                  }}
                />
              </Tooltip>
            </Grid>

            <Grid item xs={12} md={10}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Bot Name"
                    value={botDetails.name}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={botDetails.description}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <MDButton variant="outlined" color="secondary" size="small" onClick={onBack}>
            Back
          </MDButton>

          {!validated && (
            <MDButton
              variant="contained"
              color="primary"
              onClick={handleValidate}
              disabled={validating}
              size="small"
              startIcon={validating && <CircularProgress size={18} color="inherit" />}
            >
              {validating ? "Validating..." : "Validate"}
            </MDButton>
          )}

          {validated && (
            <MDButton variant="contained" color="info" size="small" onClick={onNext}>
              Save & Next
            </MDButton>
          )}
        </MDBox>

        <MDSnackbar
          color={snackbar.severity === "success" ? "success" : "error"}
          icon={snackbar.severity === "success" ? "check_circle" : "error"}
          title={snackbar.severity === "success" ? "Validation Success" : "Validation Failed"}
          dateTime={new Date().toLocaleTimeString()}
          content={snackbar.message}
          open={snackbar.open}
          close={handleCloseSnackbar}
        />
      </MDBox>
    </Fade>
  );
}

BotValidationPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isActive: PropTypes.any,
  onStepComplete: PropTypes.any,
};

export default BotValidationPage;
