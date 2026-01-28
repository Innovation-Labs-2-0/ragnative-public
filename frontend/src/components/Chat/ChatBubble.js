import React from "react";
import PropTypes from "prop-types";
import { Box, Paper, Avatar } from "@mui/material";
import { useTheme, keyframes } from "@mui/material/styles";

import SmartToyIcon from "@mui/icons-material/SmartToy";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { isDarkMode } from "utils/themeUtil";
import getContrastTextColor from "../../utils/contrastTextColor";

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

/**
 * A reusable component to display a chat message bubble with an avatar.
 * It renders plain text for user messages and formats Markdown for bot messages.
 * @param {string} message The text content of the message.
 * @param {boolean} isUser True if the message is from the user, false otherwise.
 * @param {string} [fontSize="0.865rem"] The font size for the message text.
 * @param {boolean} [isTyping=false] If true, shows a typing indicator instead of a message.
 * @param {string} [avatar=null] URL for a custom bot avatar. If not provided, a default icon is used.
 */
const ChatBubble = ({
  message,
  isUser,
  fontSize = "0.865rem",
  isTyping,
  avatar = null,
  botBubbleColor,
  userBubbleColor,
}) => {
  const theme = useTheme();

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code
          style={{
            backgroundColor: "rgba(0,0,0,0.1)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontFamily: "monospace",
          }}
          className={className}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  const finalIsUser = isTyping ? false : isUser;

  const BotAvatar = (
    <Avatar src={avatar} sx={{ width: 30, height: 30, bgcolor: "white.main" }}>
      {!avatar && <SmartToyIcon fontSize="small" />}
    </Avatar>
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: finalIsUser ? "flex-end" : "flex-start",
        alignItems: "flex-start",
        mb: 2,
        gap: 1.5,
      }}
    >
      {!finalIsUser && BotAvatar}

      <Paper
        elevation={2}
        sx={{
          p: "8px 10px 8px 10px",
          maxWidth: "80%",
          backgroundColor: finalIsUser ? userBubbleColor : botBubbleColor,
          color: finalIsUser
            ? getContrastTextColor(userBubbleColor)
            : getContrastTextColor(botBubbleColor),
          borderRadius: finalIsUser ? "20px 2px 20px 20px" : "2px 20px 20px 20px",
          wordWrap: "break-word",
          fontSize: fontSize,
          "& h1, & h2, & h3, & h4, & h5, & h6": { marginTop: "12px", marginBottom: "8px" },
          "& p": { margin: "0 0 8px 0" },
          "& p:last-child": { margin: 0 },
          "& ol, & ul": { paddingLeft: "25px", margin: "0 0 8px 0" },
          "& table": { borderCollapse: "collapse", width: "100%", margin: "10px 0" },
          "& th, & td": {
            border: `1px solid ${theme.palette.grey[400]}`,
            padding: "8px",
            textAlign: "left",
          },
          "& th": { backgroundColor: theme.palette.grey[300] },
        }}
      >
        {isTyping ? (
          <Box sx={{ display: "flex", alignItems: "center", height: "24px" }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.text.secondary,
                animation: `${bounce} 1.4s infinite ease-in-out both`,
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.text.secondary,
                animation: `${bounce} 1.4s infinite ease-in-out both`,
                animationDelay: "0.2s",
                mx: "4px",
              }}
            />
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: theme.palette.text.secondary,
                animation: `${bounce} 1.4s infinite ease-in-out both`,
                animationDelay: "0.4s",
              }}
            />
          </Box>
        ) : finalIsUser ? (
          <p style={{ margin: 0 }}>{message}</p>
        ) : (
          <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
            {message}
          </ReactMarkdown>
        )}
      </Paper>
    </Box>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.string,
  isUser: PropTypes.bool,
  fontSize: PropTypes.string,
  isTyping: PropTypes.bool,
  avatar: PropTypes.string,
  botBubbleColor: PropTypes.string,
  userBubbleColor: PropTypes.string,
};

export default ChatBubble;
