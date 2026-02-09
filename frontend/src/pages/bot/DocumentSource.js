import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDButton from "components/style-components/MDButton";
import MDTypography from "components/style-components/MDTypography";
import PropTypes from "prop-types";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { postRequest, patchRequest } from "utils/apiClient";
import { useSelector } from "react-redux";
import MDSnackbar from "components/style-components/MDSnackbar";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SecureButton from "components/SecureButton";
import FileUtil from "utils/fileUtils";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";

function DocumentSourceForm({
  onUploadComplete,
  isEditing = false,
  name,
  files,
  dataSourceType,
  dataSourceId: existingDataSourceId,
  chunkSize: existingChunkSize,
  overlapSize: existingOverlapSize,
  chunkingStrategy: existingChunkingStrategy,
  existingKnowledgeBaseId,
}) {
  const [dataSourceName, setDataSourceName] = useState(name || "");
  const [uploadedFiles, setUploadedFiles] = useState(files || []);
  const [chunkingStrategy, setChunkingStrategy] = useState(existingChunkingStrategy || "fixed");
  const [chunkSize, setChunkSize] = useState(existingChunkSize || "2000");
  const [overlapSize, setOverlapSize] = useState(existingOverlapSize || "200");
  const [uploadDocumentsVisible, setUploadDocumentsVisible] = useState(isEditing);
  const [documentsConfigVisible, setDocumentsConfigVisible] = useState(!isEditing);
  const { kbId } = useKnowledgeBaseContext();
  const knowledgeBaseId = kbId || existingKnowledgeBaseId;

  const [dataSourceId, setDataSourceId] = useState(existingDataSourceId || "");
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    open: false,
    title: "",
    color: "info",
    content: "",
    icon: "info", // "info" / "check" / "warning" / "error"
  });

  useEffect(() => {
    if (files && files.length > 0) {
      setUploadedFiles(files);
    }
  }, [files]);

  const uploaderId = `hidden-uploader-${knowledgeBaseId}-${name || "new"}`;

  const chunkingStrategyOptions = [
    { value: "fixed", label: "Fixed" },
    { value: "semantic", label: "Semantic" },
    { value: "delimiter", label: "Delimiter" },
  ];

  const proceedToUploadDocuments = async () => {
    try {
      const payload = {
        name: dataSourceName,
        chunk_strategy: chunkingStrategy,
        chunk_config: { chunk_size: chunkSize, chunk_overlap: overlapSize },
        source_type: dataSourceType,
        knowledge_base: knowledgeBaseId,
      };
      const newDataSource = await postRequest("/datasource/", payload);
      if (newDataSource) {
        setDataSourceId(newDataSource._id);
        setUploadDocumentsVisible(true);
        setDocumentsConfigVisible(false);
      }
    } catch (error) {
      console.error("Failed to create data source:", error);
    }
  };

  const allowedExtensions = [".pdf", ".doc", ".docx", ".txt", ".md"];

  const validateFiles = (files) => {
    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (allowedExtensions.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setAlertConfig({
        open: true,
        severity: "error",
        title: "Some files were not uploaded. Allowed formats: PDF, DOC, DOCX, TXT, MD.",
        color: "error",
        icon: "warning",
        content: invalidFiles.map((file) => file.name).join(", "),
      });
    }

    return validFiles;
  };

  const createBatches = (files, batchSize) => {
    const batches = [];
    for (let i = 0; i < files.length; i += batchSize) {
      batches.push(files.slice(i, i + batchSize));
    }
    return batches;
  };

  const uploadFilesInBatches = async (batches, knowledgeBaseId, dataSourceId) => {
    const filesData = [];
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (file) => {
          console.log(`Uploading ${file.name} for data source ${dataSourceId}...`);
          const encodedFilename = encodeURIComponent(file.name);
          const fileUtil = new FileUtil(file);
          const checkSum = await fileUtil.getChecksum();

          const documentUpload = await patchRequest(
            `/datasource/upload/${knowledgeBaseId}/${dataSourceId}?filename=${encodedFilename}&file_size=${file.size}`,
            file,
            {
              headers: {
                "Content-Type": "application/octet-stream",
                "x-file-checksum": checkSum,
              },
            }
          );
          filesData.push({
            ...file,
            name: documentUpload,
          });
        })
      );
    }
    return filesData;
  };

  const handleUploadDocuments = async (filesToUpload) => {
    if (!dataSourceId) {
      console.error("Cannot upload files: Data Source ID is not yet set. Click 'Proceed' first.");
      return;
    }

    const batches = createBatches(filesToUpload, 10);
    const filesData = await uploadFilesInBatches(batches, knowledgeBaseId, dataSourceId);

    setUploadedFiles((prevFiles) => [...prevFiles, ...filesData]);
  };

  const handleFileSelect = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = validateFiles(selectedFiles);

    if (validFiles.length > 0) {
      await handleUploadDocuments(validFiles);
    }

    event.target.value = null;
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(droppedFiles);

    if (validFiles.length > 0) {
      await handleUploadDocuments(validFiles);
    }
  };

  const handleDone = async () => {
    try {
      if (isEditing) {
        setIsSaving(true);
        // If editing, this is where you would save metadata changes.
        const metadataPayload = {
          name: dataSourceName,
          chunk_strategy: chunkingStrategy,
          chunk_config: { chunk_size: chunkSize, chunk_overlap: overlapSize },
          source_type: dataSourceType,
          knowledge_base: knowledgeBaseId,
        };
        await patchRequest(`/datasource/update/${dataSourceId}`, metadataPayload);
      }

      if (onUploadComplete) {
        onUploadComplete({
          name: dataSourceName,
          files: uploadedFiles,
        });
      }
      setIsSaving(false);
    } catch (error) {
      console.log("Error while updating document's metadata", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadClick = () => {
    document.getElementById(uploaderId).click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleChunkStrategyChange = (event) => {
    setChunkingStrategy(event.target.value);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label={dataSourceName ? "Data Source Name" : ""}
          value={dataSourceName}
          onChange={(e) => setDataSourceName(e.target.value)}
          placeholder="Enter a name for your data source"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Chunking Strategy</InputLabel>
          <Select
            value={chunkingStrategy}
            label="Chunking Strategy"
            onChange={(e) => {
              handleChunkStrategyChange(e);
            }}
            sx={{ height: "44px" }}
            endAdornment={
              <Tooltip
                title={
                  <>
                    Choose how your documents are split into chunks:-
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: "1.2rem",
                        textAlign: "left",
                        listStylePosition: "outside",
                      }}
                    >
                      <li>Fixed: Splits text into chunks of a fixed character length.</li>
                      <li>
                        Semantic: Splits text based on meaning or sentence boundaries, aiming to
                        keep related content together.
                      </li>
                      <li>
                        Delimiter: Splits text using a custom delimiter (e.g., paragraphs, headings,
                        or specific characters) that you define.
                      </li>
                    </ul>
                  </>
                }
                placement="bottom"
              >
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="16px" />
                </IconButton>
              </Tooltip>
            }
          >
            {chunkingStrategyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {chunkingStrategy === "semantic" && (
            <div style={{ color: "#fb8c00" }}>
              {`Note: The Semantic chunking strategy is experimental and may not always give stable
              results.`}
            </div>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Chunk Size"
          value={chunkSize}
          onChange={(e) => setChunkSize(e.target.value)}
          InputProps={{
            endAdornment: (
              <Tooltip title=" This defines the maximum number of characters in a single document chunk.">
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="16px" />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Overlap Size"
          value={overlapSize}
          onChange={(e) => setOverlapSize(e.target.value)}
          InputProps={{
            endAdornment: (
              <Tooltip
                title={
                  <>
                    This is the number of characters to overlap between consecutive chunks.
                    <br /> Overlapping helps maintain context across chunks, ensuring that if a key
                    piece of information falls at a chunk boundary, it&apos;s still captured in the
                    adjacent chunk.
                  </>
                }
              >
                <IconButton size="small">
                  <HelpOutlineIcon fontSize="16px" />
                </IconButton>
              </Tooltip>
            ),
          }}
        />
      </Grid>

      {documentsConfigVisible && (
        <Grid item xs={12}>
          <MDBox display="flex" justifyContent="flex-end">
            <SecureButton
              buttonKey="/button/add-document"
              variant="contained"
              color="primary"
              size="small"
              onClick={proceedToUploadDocuments}
              disabled={!dataSourceName.trim()}
            >
              Proceed
            </SecureButton>
          </MDBox>
        </Grid>
      )}

      {uploadDocumentsVisible && (
        <Grid item xs={12}>
          <MDBox mb={2} mt={2}>
            <MDTypography variant="h6" fontWeight="medium">
              Upload Your Documents
            </MDTypography>
          </MDBox>
          <Paper
            variant="outlined"
            onClick={handleUploadClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="upload-documents"
            sx={{
              borderStyle: isDragging ? "dashed" : "solid",
              borderColor: isDragging ? "primary.main" : "divider",
              p: 2,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <CloudUploadIcon sx={{ mb: 0.5, mt: 0.5 }} fontSize="medium" />
            <MDTypography variant="body1" color="textSecondary" mb={0.5}>
              Drag & Drop Files Here or Click to Upload
            </MDTypography>
            <MDBox display="flex" justifyContent="center" alignItems="center" gap={2} mt={1}>
              <Tooltip title="PDF">
                <PictureAsPdfIcon color="error" fontSize="medium" />
              </Tooltip>
              <Tooltip title="DOC / DOCX">
                <DescriptionIcon color="primary" fontSize="medium" />
              </Tooltip>
              <Tooltip title="TXT">
                <ArticleIcon color="info" fontSize="medium" />
              </Tooltip>
              <Tooltip title="Markdown (.md)">
                <InsertDriveFileIcon color="secondary" fontSize="medium" />
              </Tooltip>
            </MDBox>
            <input
              id={uploaderId}
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.md"
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </Paper>

          {uploadedFiles.length > 0 && (
            <MDBox mt={2}>
              <MDTypography variant="body2" mb={1} color="textSecondary">
                Uploaded Files ({uploadedFiles.length}):
              </MDTypography>
              <MDBox sx={{ maxHeight: "150px", overflowY: "auto" }}>
                {uploadedFiles.map((file, index) => (
                  <MDTypography
                    key={`${file.name}-${index}`}
                    variant="body2"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    <a
                      href={`/preview-document/kb/${knowledgeBaseId}/ds/${dataSourceId}?file=${
                        typeof file === "string" ? file : file.name
                      }`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      • {typeof file === "string" ? file : file.name}
                    </a>
                  </MDTypography>
                ))}
              </MDBox>
            </MDBox>
          )}

          <MDBox mt={3} display="flex" justifyContent="flex-end">
            <SecureButton
              buttonKey="/button/upload-document"
              variant="contained"
              color="info"
              size="small"
              onClick={handleDone}
              disabled={isSaving || uploadedFiles.length === 0}
            >
              {isSaving ? <CircularProgress size={20} color="primary" /> : "Done"}
            </SecureButton>
          </MDBox>
        </Grid>
      )}

      <MDSnackbar
        color={alertConfig.color}
        icon={alertConfig.icon}
        title={alertConfig.title}
        content={alertConfig.content}
        dateTime=""
        open={alertConfig.open}
        onClose={() => setAlertConfig({ ...alertConfig, open: false })}
        close={() => setAlertConfig({ ...alertConfig, open: false })}
      />
    </Grid>
  );
}

DocumentSourceForm.propTypes = {
  onUploadComplete: PropTypes.func,
  isEditing: PropTypes.bool,
  name: PropTypes.string,
  files: PropTypes.array,
  dataSourceType: PropTypes.string,
  dataSourceId: PropTypes.string,
  chunkSize: PropTypes.string,
  overlapSize: PropTypes.string,
  chunkingStrategy: PropTypes.string,
  existingKnowledgeBaseId: PropTypes.string,
};

export default DocumentSourceForm;
