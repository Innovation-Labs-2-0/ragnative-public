import PropTypes from "prop-types";
import React, { useState, useEffect, useRef } from "react"; // Use useRef
import { Document, Page } from "react-pdf";
import { Typography, CircularProgress, useTheme } from "@mui/material";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import MDBox from "components/style-components/MDBox";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Footer = ({ pageNumber, numPages }) => {
  return (
    <MDBox
      sx={{
        display: "flex",
        justifyContent: "flex-end",
      }}
      key={`page_${pageNumber}`}
    >
      <span style={{ fontSize: 12, marginBottom: 24, marginTop: 0, color: "gray" }}>
        Page {pageNumber} of {numPages}
      </span>
    </MDBox>
  );
};

const PdfViewer = ({ fileUrl, initialPage }) => {
  const [numPages, setNumPages] = useState(null);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

  const pageRefs = useRef(new Map());
  const scrollToPage = () => {
    const pageNode = pageRefs.current.get(initialPage);
    if (pageNode) {
      pageNode.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  useEffect(() => {
    setLoading(true);
    setTimeout(scrollToPage, 1000); // takes time to load the pdf, so waiting for the pdf to load, and then scroll to page
    setLoading(false);
  }, [initialPage, fileUrl, numPages]);

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }) => {
    setNumPages(nextNumPages);
    pageRefs.current.clear();
  };

  const setPageRef = (pageNumber, node) => {
    if (node) {
      pageRefs.current.set(pageNumber, node);
    } else {
      pageRefs.current.delete(pageNumber);
    }
  };
  if (loading) return <CircularProgress />;

  return (
    <MDBox
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background,
        height: "calc(100vh - 150px)", // Adjust height as needed
        overflowY: "auto",
      }}
    >
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<CircularProgress />}
        error={<Typography color="error">Failed to load PDF file.</Typography>}
        scale={1.3}
      >
        {numPages &&
          Array.from(new Array(numPages), (el, index) => {
            const pageNumber = index + 1;
            return (
              <>
                <MDBox
                  ref={(node) => {
                    setPageRef(pageNumber, node);
                  }}
                  key={`page_container_${pageNumber}`}
                  sx={{
                    marginBottom: "5px",
                  }}
                >
                  <Page
                    key={`page_${pageNumber}`}
                    pageNumber={pageNumber}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                  />
                </MDBox>
                <Footer pageNumber={pageNumber} numPages={numPages} key={`page_${pageNumber}`} />
              </>
            );
          })}
      </Document>
    </MDBox>
  );
};

PdfViewer.defaultProps = {
  initialPage: 1,
};

PdfViewer.propTypes = {
  fileUrl: PropTypes.string,
  initialPage: PropTypes.number,
};

Footer.propTypes = {
  pageNumber: PropTypes.number,
  numPages: PropTypes.number,
};

export default PdfViewer;
