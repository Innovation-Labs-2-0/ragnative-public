import React, { useState, useEffect } from "react";
import { CircularProgress, Paper, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import MDTypography from "components/style-components/MDTypography";
import { decodeArrayBufferWithBOM } from "./TextUtils"; // Adjust path if needed
import MDBox from "components/style-components/MDBox";
import { isDarkMode } from "utils/themeUtil";

const TxtViewer = ({ fileUrl }) => {
  const [text, setText] = useState("");
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fileUrl) {
      setText("No file URL provided.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(fileUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.arrayBuffer();
      })
      .then((arrayBuffer) => {
        // Use our new smart decoder function
        const decodedText = decodeArrayBufferWithBOM(arrayBuffer);
        setText(decodedText);
      })
      .catch((error) => {
        console.error("Failed to fetch or decode text file:", error);
        setText("Could not load the file content.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [fileUrl]);

  if (loading) return <CircularProgress />;
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
          color: theme.palette.getContrastText(theme.palette.background.default),
          backgroundColor: isDarkMode() ? theme.palette.grey[700] : theme.palette.background.paper,
          borderRadius: "0px",
        }}
      >
        <MDTypography
          component="div"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            p: 4,
          }}
        >
          {text}
        </MDTypography>
      </Paper>
    </MDBox>
  );
};

TxtViewer.propTypes = {
  fileUrl: PropTypes.string.isRequired,
};

export default TxtViewer;
