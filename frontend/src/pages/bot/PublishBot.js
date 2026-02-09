import React, { useState, useEffect } from "react";
import { getRequest, putRequest } from "../../utils/apiClient";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
  Box as MuiBox,
  useTheme,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";

import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDButton from "components/style-components/MDButton";

import ChatPanel from "../../components/Chat/ChatPanel";
import NotificationItem from "components/Items/NotificationItem";

import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { isDarkMode } from "utils/themeUtil";
import MDInput from "components/style-components/MDInput";
import SecureButton from "components/SecureButton";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useBotContext, useBotConfigTabContext } from "context/BotContext";
const PublishBot = ({ onBack }) => {
  const theme = useTheme();
  const { setActiveTab } = useBotConfigTabContext();
  const [showAlert, setShowAlert] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [embedURL, setEmbedURL] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy Code");
  const [botInfo, setBotInfo] = useState(null);
  const [requestInProgress, setRequestInProgress] = useState(false);
  const [confirmStatusModal, setConfirmStatusModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);
  const navigate = useNavigate();
  const {
    chatbotId: botId,
    editMode,
    chatbotVersion: botVersion,
    active: botActive,
    setActive,
  } = useBotContext();

  const handleAlert = (text, color = "info") => {
    const details = {
      color,
      text,
      icon: <NewReleasesRoundedIcon color={color} fontSize="medium" />,
    };
    setNotificationDetails(details);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handlePublish = async () => {
    try {
      const response = await putRequest(`/bot/publish/${botId}`);
      if (response) {
        const url = `${window.location.origin}/embed/${botId}/version/${botVersion}`;
        setEmbedURL(response.embed_url);
        handleAlert("Your bot has been published successfully!", "success");
      } else {
        throw new Error("API did not return a valid response.");
      }
    } catch (error) {
      console.error("Error in publish API call:", error);
      handleAlert("Failed to publish the bot. Please try again.", "error");
    }
  };

  const handleImprove = () => {
    setActiveTab(0);
  };

  const updateBotInfo = (botInformation) => {
    if (botInformation?.embed_url) {
      setEmbedURL(botInformation.embed_url);
    }
    setBotInfo(botInformation);
  };
  useEffect(() => {
    const iframeString = `<div style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
    <iframe
      src="${embedURL}"
      width="300"
      height="400"
      style="border: none; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.15);"
      title="${botInfo?.name || "Chatbot"}"
    ></iframe>
  </div>`;
    setEmbedCode(iframeString);
  }, [embedURL]);

  const getBotInfo = async () => {
    try {
      const botInformation = await getRequest(`/bot/${botId}/version/${botVersion}`);
      if (botInformation) {
        updateBotInfo(botInformation);
      }
    } catch (error) {
      console.error("Error in getting bot info API call:", error);
    }
  };

  const handleCopyToClipboard = (textToCopy) => {
    navigator.clipboard.writeText(textToCopy);
    handleAlert("Copied to clipboard!", "success");
  };

  const handleCopyInModal = () => {
    navigator.clipboard.writeText(embedCode);
    setCopyButtonText("Copied!");
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleToggleActive = (e, value) => {
    if (value === null) return;
    setPendingStatus(value);
    setConfirmStatusModal(true);
  };
  const confirmStatusChange = async () => {
    try {
      setRequestInProgress(true);

      const payload = { active: pendingStatus };
      const botInformation = await putRequest(`/bot/${botId}`, payload);
      handleAlert(`Bot status changed to ${pendingStatus ? "Active" : "Inactive"}!`, "success");
      setActive(pendingStatus);
    } catch (error) {
      console.error("Error updating bot status:", error);
      setActive(botActive);
      handleAlert(`Bot status couldn't be changed!`, "error");
      handleAlert("Failed to update bot status.", "error");
    } finally {
      setConfirmStatusModal(false);
      setPendingStatus(null);
      setRequestInProgress(false);
    }
  };
  const cancelStatusChange = () => {
    setConfirmStatusModal(false);
    setPendingStatus(null);
  };

  useEffect(() => {
    getBotInfo();
  }, [botId, botVersion]);

  return (
    <>
      <MDBox pt={2} mb={0}>
        <Grid container spacing={4} sx={{ height: "80%" }}>
          <Grid item xs={12} md={7}>
            <MDBox display="flex" flexDirection="column" height="100%">
              <MDTypography variant="h5" fontWeight="medium" pl={4}>
                Try your bot
              </MDTypography>
              <MDBox gap={4} mt={8} px={4} py={2} display="flex" justifyContent="flex-start">
                <SecureButton
                  buttonKey="/button/publish-bot"
                  variant="contained"
                  color="info"
                  onClick={handlePublish}
                  fullWidth
                  disabled={!!embedURL}
                >
                  Publish Your Bot
                </SecureButton>
                <SecureButton
                  buttonKey="/button/improve-bot"
                  variant="outlined"
                  color="info"
                  fullWidth
                  onClick={handleImprove}
                >
                  Improve Your Bot
                </SecureButton>
              </MDBox>

              {embedURL ? (
                <MDBox mt={6} px={4}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium" mb={1}>
                    Your bot is live at:
                  </MDTypography>
                  <MDInput
                    fullWidth
                    readOnly
                    value={embedURL}
                    className="embed-url-input"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => handleCopyToClipboard(embedURL)} edge="end">
                            <ContentCopyIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <MDBox mt={1} display="flex" justifyContent="flex-end">
                    <Link
                      component="button"
                      variant="body2"
                      onClick={handleOpenModal}
                      sx={{ cursor: "pointer" }}
                    >
                      Embed your bot.
                    </Link>
                  </MDBox>
                </MDBox>
              ) : (
                <MDBox mt={1} p={4}>
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium" mb={1}>
                    Publish your bot to get the Bot URL and embed code!
                  </MDTypography>
                </MDBox>
              )}
              {editMode && (
                <MDBox
                  px={4}
                  py={2}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDTypography variant="subtitle2" color="text" fontWeight="medium">
                    Bot Status:
                  </MDTypography>

                  <ToggleButtonGroup
                    size="small"
                    exclusive
                    value={botActive}
                    onChange={(e, value) => handleToggleActive(e, value)}
                    aria-label="Active"
                    sx={{ height: "25px", mt: 1 }}
                    disabled={requestInProgress}
                  >
                    <ToggleButton value={true} sx={{ px: 3, color: "primary" }}>
                      Active
                    </ToggleButton>
                    <ToggleButton value={false} sx={{ px: 3 }}>
                      Inactive
                    </ToggleButton>
                  </ToggleButtonGroup>
                </MDBox>
              )}

              <MDBox display="flex" justifyContent="flex-end" gap={2} mt={10} px={4}>
                <MDButton variant="outlined" color="secondary" size="small" onClick={onBack}>
                  Back
                </MDButton>
                <MDButton
                  variant="contained"
                  color="info"
                  size="small"
                  onClick={() => navigate("/manage-bots")}
                >
                  Finish
                </MDButton>
              </MDBox>

              <MDBox mt="auto" width="100%">
                {showAlert && (
                  <NotificationItem
                    icon={notificationDetails?.icon}
                    title={notificationDetails?.text}
                    color={notificationDetails?.color}
                  />
                )}
              </MDBox>
            </MDBox>
          </Grid>

          <Grid
            item
            xs={12}
            md={5}
            mb={2}
            px={3}
            sx={{
              height: { xs: "65vh", md: "70.5vh" },
              maxHeight: "600px",
            }}
          >
            {botInfo && (
              <ChatPanel
                title={botInfo.name}
                url={`/chat/${botId}/version/${botVersion}`}
                botAvatar={botInfo.avatar}
                botColors={botInfo.bot_colors}
              />
            )}
          </Grid>
        </Grid>
        <Dialog open={confirmStatusModal} onClose={cancelStatusChange}>
          <DialogTitle>Confirm Status Change</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to change the bot status to{" "}
              <strong>{pendingStatus ? "Active" : "Inactive"}</strong>?
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <MDButton onClick={cancelStatusChange} color="secondary">
              Cancel
            </MDButton>

            <MDButton
              onClick={confirmStatusChange}
              variant="contained"
              color="info"
              disabled={requestInProgress}
            >
              Confirm
            </MDButton>
          </DialogActions>
        </Dialog>
      </MDBox>

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="md">
        <DialogTitle>Embed Your Chatbot</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Copy this code and paste it just before the closing body tag of your HTML file.
          </DialogContentText>

          <MuiBox sx={{ borderRadius: "8px", overflow: "hidden" }}>
            <SyntaxHighlighter language="html" style={tomorrow} showLineNumbers wrapLines={true}>
              {embedCode}
            </SyntaxHighlighter>
          </MuiBox>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={handleCloseModal} color="secondary">
            Close
          </MDButton>
          <MDButton onClick={handleCopyInModal} variant="contained" color="info">
            {copyButtonText}
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
PublishBot.propTypes = {
  onBack: PropTypes.func,
};

export default PublishBot;
