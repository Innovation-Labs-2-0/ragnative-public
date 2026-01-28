import React from "react";

import { Box, Card, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import MDInput from "components/style-components/MDInput";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";

import ChatBubble from "../../components/Chat/ChatBubble";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import getContrastTextColor from "../../utils/contrastTextColor";

function DummyChatPanel({
  botAvatar,
  selectedHeaderColor,
  selectedBotBubbleColor,
  selectedUserBubbleColor,
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: "15px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <MDBox
        px={3}
        sx={{
          borderRadius: "8px 8px 0px 0px",
          p: 1,
          backgroundColor: selectedHeaderColor,
        }}
      >
        <MDTypography
          variant="h6"
          fontWeight="medium"
          textTransform="capitalize"
          sx={{
            color: getContrastTextColor(selectedHeaderColor),
          }}
        >
          Live Preview
        </MDTypography>
      </MDBox>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          backgroundColor: (theme) => theme.palette.background.default,
          p: 2,
        }}
      >
        <ChatBubble
          message="Hello! How can i assist you today?"
          isUser={false}
          avatar={botAvatar}
          botBubbleColor={selectedBotBubbleColor}
          userBubbleColor={selectedUserBubbleColor}
        />

        <ChatBubble
          message="Hi"
          isUser={true}
          avatar={null}
          botBubbleColor={selectedBotBubbleColor}
          userBubbleColor={selectedUserBubbleColor}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <MDInput
          fullWidth
          placeholder="Type your message..."
          sx={{
            borderRadius: "5px",
            backgroundColor: theme.palette.mode,
          }}
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" sx={{ color: selectedHeaderColor }}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Card>
  );
}

DummyChatPanel.propTypes = {
  botAvatar: PropTypes.string,
  selectedHeaderColor: PropTypes.string,
  selectedBotBubbleColor: PropTypes.string,
  selectedUserBubbleColor: PropTypes.string,
};

export default DummyChatPanel;
