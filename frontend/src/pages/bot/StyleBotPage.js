import React, { useState, useEffect } from "react";
import { Grid, Tooltip, Avatar } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDButton from "components/style-components/MDButton";
import PropTypes from "prop-types";
import { putRequest, getRequest } from "utils/apiClient";
import DummyChatPanel from "components/Chat/DummyChatPanel";
import ColorSelector from "components/ColorPicker/ColorSelector";
import { useBotContext } from "context/BotContext";

const avatars = [
  { value: "bot1", src: "/assets/avatar_icons/avatar-1.png" },
  { value: "bot2", src: "/assets/avatar_icons/avatar-2.png" },
  { value: "bot3", src: "/assets/avatar_icons/avatar-3.png" },
  { value: "bot5", src: "/assets/avatar_icons/avatar-5.png" },
  { value: "bot4", src: "/assets/avatar_icons/avatar-4.png" },
  { value: "bot6", src: "/assets/avatar_icons/avatar-6.png" },
];

function StyleBotPage({ isActive, onStepComplete, onBack, onNext }) {
  const [botAvatar, setBotAvatar] = useState("/assets/avatar_icons/avatar-1.png");
  const [headerColor, setHeaderColor] = useState("#1976d2");
  const [botBubbleColor, setBotBubbleColor] = useState("#e0e0e0");
  const [userBubbleColor, setUserBubbleColor] = useState("#1976d2");

  const { chatbotId } = useBotContext();

  const handleBotAvatar = (index) => {
    setBotAvatar(avatars[index].src);
  };

  const onClickSave = async () => {
    try {
      const payload = {
        avatar: botAvatar,
        bot_colors: {
          header_color: headerColor,
          bot_bubble_color: botBubbleColor,
          user_bubble_color: userBubbleColor,
        },
      };
      await putRequest(`/bot/${chatbotId}`, payload);
      onStepComplete();
      onNext();
    } catch (error) {
      console.log("Error while saving styling of bot:", error);
    }
  };

  const getBotStyles = async () => {
    try {
      const response = await getRequest(`/bot/${chatbotId}`);
      if (!response?.avatar || !response?.bot_colors) {
        setBotAvatar("/assets/avatar_icons/avatar-1.png");
        setHeaderColor("#1976d2");
        setBotBubbleColor("#e0e0e0");
        setUserBubbleColor("#1976d2");
      } else {
        setBotAvatar(response.avatar);
        setHeaderColor(response.bot_colors.header_color);
        setBotBubbleColor(response.bot_colors.bot_bubble_color);
        setUserBubbleColor(response.bot_colors.user_bubble_color);
      }
    } catch (error) {
      console.log("Error while getting bot styles:", error);
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    getBotStyles();
  }, [isActive, chatbotId]);

  return (
    <MDBox mt={1.5} p={2}>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12} md={6} lg={7}>
          <MDTypography size="sm" sx={{ fontSize: "14px" }}>
            Select your Bot Avatar
          </MDTypography>

          <Grid container spacing={2}>
            {avatars.map((avatar) => (
              <Grid item key={avatar.value}>
                <div
                  onClick={() => handleBotAvatar(avatars.indexOf(avatar))}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    borderRadius: "50%",
                    padding: "6px",
                    boxShadow:
                      botAvatar === avatar.src ? "0 0 0 3px #1976d2" : "0 2px 6px rgba(0,0,0,0.15)",
                    transition: "transform 0.2s ease",
                    transform: botAvatar === avatar.src ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  <Avatar src={avatar.src} alt={avatar.label} sx={{ width: 50, height: 50 }} />
                  {botAvatar === avatar.src && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        color: "#1976d2",
                        background: "white",
                        borderRadius: "50%",
                      }}
                    />
                  )}
                </div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Header Color */}
            <Grid item xs={12} md={6}>
              <MDTypography size="sm" sx={{ fontSize: "14px", mb: 1 }}>
                Select Header Color
              </MDTypography>
              <ColorSelector color={headerColor} onChange={setHeaderColor} />
            </Grid>

            {/* Chatbot Bubble Color */}
            <Grid item xs={12} md={6}>
              <MDTypography size="sm" sx={{ fontSize: "14px", mb: 1 }}>
                Select Chatbot Bubble Color
              </MDTypography>
              <ColorSelector color={botBubbleColor} onChange={setBotBubbleColor} />
            </Grid>
          </Grid>

          {/* User Bubble Color in next row */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <MDTypography size="sm" sx={{ fontSize: "14px", mb: 1 }}>
                Select User Bubble Color
              </MDTypography>
              <ColorSelector color={userBubbleColor} onChange={setUserBubbleColor} />
            </Grid>
          </Grid>

          <MDBox display="flex" justifyContent="flex-end" gap={2} sx={{ mt: 6 }}>
            <MDButton variant="outlined" color="secondary" onClick={onBack} size="small">
              Back
            </MDButton>
            <MDButton variant="contained" color="primary" size="small" onClick={onClickSave}>
              Save & Next
            </MDButton>
          </MDBox>
        </Grid>

        <Grid
          item
          xs={12}
          md={6}
          lg={4.8}
          sx={{
            height: { xs: "65vh", md: "65vh" },
            maxHeight: "600px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <DummyChatPanel
            botAvatar={botAvatar}
            selectedHeaderColor={headerColor}
            selectedBotBubbleColor={botBubbleColor}
            selectedUserBubbleColor={userBubbleColor}
          ></DummyChatPanel>
        </Grid>
      </Grid>
    </MDBox>
  );
}

StyleBotPage.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isActive: PropTypes.any,
  onStepComplete: PropTypes.any,
};

export default StyleBotPage;
