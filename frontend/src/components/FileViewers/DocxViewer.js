import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import mammoth from "mammoth";
import { Box, CircularProgress, Paper, Typography, useTheme } from "@mui/material";
import MDBox from "components/style-components/MDBox";
import { isDarkMode } from "utils/themeUtil";

const DocxViewer = ({ fileUrl }) => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (!fileUrl) {
      setError("No file URL provided.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const options = {
      // The Style Map is mapping between Word styles and HTML classes.
      // The format is: "word-selector => html-tag.css-class:modifier"
      styleMap: [
        // === Headings ===
        "p[style-name='Heading 1'] => h1.doc-heading-1:fresh",
        "p[style-name='Heading 2'] => h2.doc-heading-2:fresh",
        "p[style-name='Heading 3'] => h3.doc-heading-3:fresh",

        // === Text Formatting ===
        "p[style-name='Normal'] => p.doc-normal",
        "p[style-name='Intense Quote'] => blockquote.doc-quote",

        // Inline formatting
        "r[style-name='Emphasis'] => em", // Maps character style "Emphasis" to <em>
        "r[style-name='Strong'] => strong", // Maps character style "Strong" to <strong>

        // Map basic bold and italic if not using named styles
        "b => strong",
        "i => em",

        // === Lists ===
        // Mammoth handles these well by default, but you can add classes if needed.
        "p[style-name='List Paragraph'] => li:fresh",

        // === Code Blocks / Indentation ===
        // The most reliable way to preserve indentation and fixed-width fonts.
        // Use the "Code" style in Word for this.
        "p[style-name='Code'] => pre:fresh",

        // === Custom Font Styles (The Key to High Fidelity) ===
        // This requires creating custom character styles in Word.
        // For example, create a style in Word named "Calibri 10pt".
        "r[style-name='Calibri 10pt'] => span.font-calibri-10",
        "r[style-name='Red Text'] => span.font-red",
      ],
      // This ensures images are embedded directly in the HTML
      convertImage: mammoth.images.inline((element) => {
        return element.read("base64").then((imageBuffer) => ({
          src: `data:${element.contentType};base64,${imageBuffer}`,
        }));
      }),
    };

    fetch(fileUrl)
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        mammoth
          .convertToHtml({ arrayBuffer }, options)
          .then((result) => {
            setHtml(result.value);
            if (result.messages.length > 0) {
              console.warn("Mammoth.js conversion messages:", result.messages);
            }
          })
          .catch((err) => {
            console.log("Error while rendering the file", err);
            setError("Failed to render DOCX file.", err);
          });
      })
      .catch((err) => {
        console.log("Error while rendering the file", err);
        setError("Failed to fetch DOCX file.", err);
      })
      .finally(() => setLoading(false));
  }, [fileUrl]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Typography color="error" sx={{ p: 2 }}>
        {error}
      </Typography>
    );

  return (
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
          padding: { xs: 2, md: 4 },
          fontSize: "0.875rem",
          borderRadius: "0px",
          overflowWrap: "break-word",
          color: theme.palette.getContrastText(theme.palette.background.default),
          backgroundColor: isDarkMode() ? theme.palette.grey[700] : theme.palette.background.paper,

          fontFamily: "sans-serif",
          "& p.doc-normal": {
            lineHeight: 1.7,
            marginBlock: "1em",
          },
          "& a": { color: theme.palette.primary.main, textDecoration: "underline" },
          "& .doc-heading-1": { fontSize: "2em", fontWeight: "bold", marginBlock: "0.67em" },
          "& .doc-heading-2": { fontSize: "1.5em", fontWeight: "bold", marginBlock: "0.83em" },
          "& .doc-heading-3": { fontSize: "1.17em", fontWeight: "bold", marginBlock: "1em" },
          "& .doc-quote": {
            borderLeft: `4px solid ${theme.palette.grey[400]}`,
            paddingLeft: "16px",
            margin: "1.5em 0",
            color: theme.palette.text.secondary,
            fontStyle: "italic",
          },
          "& pre": {
            backgroundColor: theme.palette.grey[100],
            padding: "16px",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "0.9em",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            overflowX: "auto",
            tabSize: 4,
          },

          "& ul, & ol": {
            paddingLeft: "30px",
            marginBlock: "1em",
          },
          "& li": {
            marginBottom: "0.5em",
          },

          "& .font-calibri-10": {
            fontFamily: "Calibri, sans-serif",
            fontSize: "10pt",
          },
          "& .font-red": {
            color: "red",
          },

          "& img": { maxWidth: "100%", height: "auto", display: "block" },
          "& table": {
            width: "100% !important",
            display: "block",
            overflowX: "auto",
            borderCollapse: "collapse",
            marginBlock: "1em",
            "& th, & td": {
              border: `1px solid ${theme.palette.divider}`,
              padding: "8px 12px",
            },
            "& th": { fontWeight: "bold", backgroundColor: theme.palette.grey[50] },
          },
        }}
      >
        <Box dangerouslySetInnerHTML={{ __html: html }} />
      </Paper>
    </MDBox>
  );
};

DocxViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
};

export default DocxViewer;
