import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CircularProgress, Paper, useTheme } from "@mui/material";
import { decodeArrayBufferWithBOM } from "./TextUtils";
import MDBox from "components/style-components/MDBox";
import { isDarkMode } from "utils/themeUtil";

const MarkdownViewer = ({ fileUrl }) => {
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    if (!fileUrl) {
      setMarkdown("No file URL provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => setMarkdown(decodeArrayBufferWithBOM(arrayBuffer)))
      .catch((error) => setMarkdown("Could not load file content."))
      .finally(() => setLoading(false));
  }, [fileUrl]);

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
            backgroundColor: "rgba(155, 155, 155, 0.34)",
            padding: "2px 4px",
            borderRadius: "4px",
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
          className={className}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <MDBox
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.background,
          height: "calc(100vh - 150px)",
          overflowY: "auto",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderColor: theme.palette.background,
            borderRadius: "2px",
            fontSize: "0.875rem",
            color: theme.palette.getContrastText(theme.palette.background.default),
            backgroundColor: isDarkMode()
              ? theme.palette.grey[700]
              : theme.palette.background.paper,
            fontFamily: [
              "-apple-system",
              "BlinkMacSystemFont",
              '"Segoe UI"',
              "Helvetica",
              "Arial",
              "sans-serif",
              '"Apple Color Emoji"',
              '"Segoe UI Emoji"',
            ].join(","),
            "& h1, & h2, & h3, & h4, & h5, & h6": { marginTop: "24px", marginBottom: "16px" },
            "& p": { margin: "0 0 16px 0", lineHeight: 1.7 },
            "& ol, & ul": { paddingLeft: "25px", margin: "0 0 16px 0" },
            "& table": { borderCollapse: "collapse", width: "100%", margin: "20px 0" },
            "& th, & td": {
              border: `1px solid ${theme.palette.grey[400]}`,
              padding: "10px 12px",
              textAlign: "left",
            },
            "& th": { backgroundColor: theme.palette.grey[200], fontWeight: "bold" },
          }}
        >
          <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
        </Paper>
      </MDBox>
    </>
  );
};

MarkdownViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
};

export default MarkdownViewer;
