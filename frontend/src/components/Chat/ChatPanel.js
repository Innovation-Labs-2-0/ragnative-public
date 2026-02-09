import React, { useState, useEffect, useRef } from "react";
import { getRequest, postRequest } from "../../utils/apiClient";

import { Box, Card, InputAdornment, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import MDInput from "components/style-components/MDInput";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";

import ChatBubble from "../../components/Chat/ChatBubble";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { isDarkMode } from "utils/themeUtil";
import { messageHistorySize } from "../../utils/constants";
import getContrastTextColor from "../../utils/contrastTextColor";
import storage from "utils/storage";

const ChatPanel = ({ url, title, botAvatar, botColors }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const chatEndRef = useRef(null);
  const theme = useTheme();
  const user_data = storage.getItem("user");
  const user_id = user_data?.id;

  const __getMessageHistory = () => {
    const mlength = messages.length;
    const startIndex = Math.max(mlength - messageHistorySize * 2, 0);
    const historyMessages = messages
      .slice(startIndex)
      .map((e) => ({ role: e.isUser ? "user" : "assistant", content: e.text }));
    return historyMessages;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;
    addMessage(currentMessage, true);
    const messageToSend = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    try {
      const response = await postRequest(url, {
        current_message: messageToSend,
        previous_messages: __getMessageHistory,
        user_id,
        ...(conversationId ? { conversation_id: conversationId } : {}),
      });
      const botReply = response?.content || "I'm not sure how to respond to that.";
      !!response.conversation_id && setConversationId(response.conversation_id);
      addMessage(botReply, false);
    } catch (error) {
      console.error("Chat API error:", error);
      addMessage("Failed to get a response from the bot.", false);
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (text, isUser) => {
    const newMessage = { text, isUser };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  const fetchWelcomeMessage = async () => {
    try {
      setIsLoading(true);
      const response = await postRequest(url, { user_id });
      const welcomeText = response?.content || "Hello! How can I help you today?";
      setMessages([{ text: welcomeText, isUser: false }]);
    } catch (error) {
      console.error("Failed to fetch welcome message:", error);
      setMessages([
        {
          text: "Sorry, I'm having trouble connecting. Please try again later.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWelcomeMessage();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          backgroundColor: botColors?.header_color || theme.palette.info.main,
        }}
      >
        <MDTypography
          variant="h6"
          fontWeight="medium"
          textTransform="capitalize"
          sx={{
            color: getContrastTextColor(botColors?.header_color) || theme.palette.info.contrastText,
          }}
        >
          {title}
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
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            message={msg.text}
            isUser={msg.isUser}
            avatar={botAvatar}
            botBubbleColor={botColors?.bot_bubble_color}
            userBubbleColor={botColors?.user_bubble_color}
          />
        ))}
        {isLoading && (
          <ChatBubble
            isTyping={true}
            avatar={botAvatar}
            botBubbleColor={botColors?.bot_bubble_color}
            userBubbleColor={botColors?.user_bubble_color}
          />
        )}
        <div ref={chatEndRef} />
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
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            borderRadius: "5px",
            backgroundColor: isDarkMode()
              ? theme.palette.grey[700]
              : theme.palette.background.paper,
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleSendMessage}
                  edge="end"
                  sx={{ color: botColors.header_color || theme.palette.primary.main }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Card>
  );
};

ChatPanel.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  botAvatar: PropTypes.string,
  botColors: PropTypes.object,
};

export default ChatPanel;
