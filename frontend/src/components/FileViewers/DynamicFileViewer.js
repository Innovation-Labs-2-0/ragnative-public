import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import PdfViewer from "./PdfViewer";
import DocxViewer from "./DocxViewer";
import MarkdownViewer from "./MarkdownViewer";
import TxtViewer from "./TxtViewer";
import { Box, Card, CardHeader, Typography } from "@mui/material";
import MDBox from "components/style-components/MDBox";
import { useTheme } from "@mui/material/styles";
import { isDarkMode } from "utils/themeUtil";
const DynamicFileViewer = ({ fileUrl, initialPage, filename }) => {
  const theme = useTheme();
  const [fileType, setFileType] = useState("");

  useEffect(() => {
    const getFileType = () => {
      if (!filename) return "";
      const extension = filename.split(".").pop().toLowerCase();
      return extension;
    };
    setFileType(getFileType());
  }, [filename]);

  const renderViewer = () => {
    try {
      const supportedFormats = {
        pdf: <PdfViewer fileUrl={fileUrl} initialPage={initialPage} key={fileUrl} />,
        docx: <DocxViewer fileUrl={fileUrl} />,
        md: <MarkdownViewer fileUrl={fileUrl} />,
        txt: <TxtViewer fileUrl={fileUrl} />,
        default: (
          <Typography color="error" variant="h6">
            Unsupported file type: .{fileType}
          </Typography>
        ),
      };
      return supportedFormats[fileType] ? supportedFormats[fileType] : supportedFormats.default;
    } catch (error) {
      console.log("Error while rendering the file", error);
    }
  };

  if (!fileUrl) {
    return <Typography>No file selected.</Typography>;
  }

  return (
    <>
      <MDBox>
        <CardHeader
          sx={{
            backgroundColor: isDarkMode()
              ? theme.palette.grey[700]
              : theme.palette.background.paper,
            borderRadius: "10px 10px 0px 0px",
            border: `1px solid ${theme.palette.divider}`,
          }}
          title={"Document Preview"}
        ></CardHeader>
        <Card
          sx={{
            backgroundColor: theme.palette.background.default,
            border: `1px solid ${theme.palette.divider}`,
            borderTopWidth: "0px",
            borderRadius: "0px 0px 10px 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <MDBox
            sx={{
              borderRadius: " 0px 0px 10px 10px",
              width: "100%",
              height: "100%",
              overflowY: "auto",
              p: 2,
            }}
          >
            {renderViewer()}
          </MDBox>
        </Card>
      </MDBox>
    </>
  );
};

DynamicFileViewer.defaultProps = {
  initialPage: 1,
};

DynamicFileViewer.propTypes = {
  filename: PropTypes.string,
  fileUrl: PropTypes.string,
  initialPage: PropTypes.number,
};

export default DynamicFileViewer;
