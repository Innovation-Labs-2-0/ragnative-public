import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRequest } from "../../utils/apiClient";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "assets/theme";

import { Box, CircularProgress } from "@mui/material";
import ChatPanel from "./ChatPanel";
const EmbedPage = () => {
  const { botId, botVersion } = useParams();
  const [botInfo, setBotInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!botId || !botVersion) return;

    const getBotInfo = async () => {
      try {
        const botInformation = await getRequest(`/bot/${botId}/version/${botVersion}`);
        if (botInformation) {
          setBotInfo(botInformation);
        } else {
          throw new Error("Bot not found.");
        }
      } catch (err) {
        console.error("Error fetching bot info for embed:", err);
        setError("Could not load bot information.");
      }
    };

    getBotInfo();
  }, [botId, botVersion]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {(() => {
        if (!botInfo && !error) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
            </Box>
          );
        }

        if (error) {
          return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <p>{error}</p>
            </Box>
          );
        }

        return (
          <Box sx={{ height: "100vh", width: "100vw", margin: 0, padding: 0 }}>
            <ChatPanel
              title={botInfo.name}
              url={`/chat/${botId}/version/${botVersion}`}
              botAvatar={botInfo.avatar}
              botColors={botInfo.bot_colors}
            />
          </Box>
        );
      })()}
    </ThemeProvider>
  );
};

export default EmbedPage;
