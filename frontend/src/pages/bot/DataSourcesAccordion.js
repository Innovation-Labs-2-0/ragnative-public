import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import MDBox from "components/style-components/MDBox";
import URLSourceForm from "./URLSource";
import DocumentSourceForm from "./DocumentSource";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { postRequest } from "utils/apiClient";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import SecureButton from "components/SecureButton";
import MDButton from "components/style-components/MDButton";

function KnowledgeBaseDataSourceAccordion({ existingDataSources = [], existingKBId }) {
  const initialDataSource = {
    _id: Date.now(),
    type: "document",
    isCompleted: false,
    name: "",
    files: [],
  };
  const [dataSources, setDataSources] = useState([initialDataSource]);
  const [expandedId, setExpandedId] = useState(dataSources[0]._id);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    index: null,
  });

  const knowledgeBaseId =
    useSelector((state) => state.knowledgeBase.knowledgeBaseId) || existingKBId;

  useEffect(() => {
    if (existingDataSources.length > 0) {
      const parsed = existingDataSources.map((ds) => {
        if (ds.source_type === "document") {
          return {
            ...ds,
            type: "document",
            name: ds.name,
            files: ds.uploaded_files || [],
            chunkStrategy: ds.chunk_strategy,
            chunkSize: ds.chunk_config?.chunk_size,
            overlapSize: ds.chunk_config?.chunk_overlap,
            isCompleted: true,
          };
        }

        if (ds.source_type === "url") {
          const isManual = !ds.url_config || ds.url_config.length === 0;
          return {
            ...ds,
            type: "url",
            name: ds.name,
            urls: ds.urls,
            manualURLs: isManual ? ds.url_loaded_files || [] : [],
            uploadedURL: isManual ? "" : ds.uploaded_url,
            urlConfig: ds.url_config || [],
            loadedFiles: ds.url_loaded_files || [],
            chunkStrategy: ds.chunk_strategy,
            chunkSize: ds.chunk_config?.chunk_size,
            overlapSize: ds.chunk_config?.chunk_overlap,
            mode: isManual ? "manual" : "dynamic",
            isCompleted: true,
          };
        }

        return ds;
      });

      const combinedDataSources = [...parsed, initialDataSource];
      setDataSources(combinedDataSources);
      setExpandedId(initialDataSource._id);
    } else {
      setDataSources([initialDataSource]);
      setExpandedId(initialDataSource._id);
    }
  }, [existingDataSources]);

  const handleAccordionChange = (_id) => {
    setExpandedId((prev) => (prev === _id ? false : _id));
  };

  const handleUploadComplete = (index, { name, files: newFiles }) => {
    const updated = [...dataSources];
    const currentSource = updated[index];

    // This is the branch for handling a NEW data source.
    if (!currentSource.isCompleted) {
      // 1. Mark the current source as complete.
      currentSource.name = name;
      currentSource.files = newFiles;
      currentSource.isCompleted = true;

      // 2. Create a new, empty data source object.
      const newSource = {
        _id: Date.now() + 1, // Ensure a unique ID
        type: "document", // Default to Document as requested
        isCompleted: false,
        name: "",
        files: [],
      };

      // 3. Add it to the dataSources array.
      setDataSources([...updated, newSource]);

      // 4. THIS IS THE KEY: Set the expandedId to the new source's ID.
      // This will collapse the one you just finished and expand the new one.
      setExpandedId(newSource._id);
    } else {
      // Logic for updating an existing data source (this part is also correct)
      currentSource.name = name;
      currentSource.files = newFiles; // Replaces the list, doesn't append
      setDataSources(updated);
      // When updating an existing source, we do NOT change the expandedId,
      // so it stays open, which is the desired behavior.
    }
  };

  const handleDelete = async (index) => {
    try {
      const updated = [...dataSources];
      const removedId = updated[index]._id;
      const ds = await postRequest(`/datasource/delete/${removedId}`);
      updated.splice(index, 1);
      setDataSources(updated);
      if (expandedId === removedId) {
        setExpandedId(updated.length > 0 ? updated[updated.length - 1]._id : null);
      }
    } catch (error) {
      console.log("Error while deleting the data source:", error);
    }
  };

  const confirmDelete = async () => {
    if (confirmDialog.index !== null) {
      await handleDelete(confirmDialog.index);
      setConfirmDialog({ open: false, index: null });
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        {dataSources.map((source, index) => (
          <Grid item xs={12} key={source._id}>
            <Accordion
              expanded={expandedId === source._id}
              onChange={() => handleAccordionChange(source._id)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="medium" />}>
                {!source.isCompleted ? (
                  <>
                    <AddIcon fontSize="small" sx={{ mr: 1 }} />
                    <strong>Add Data Source</strong>
                  </>
                ) : (
                  <MDBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                  >
                    <MDBox display="flex" alignItems="center" gap={1}>
                      {source.type === "document" && <DescriptionOutlinedIcon fontSize="small" />}
                      {source.type === "url" && <LinkOutlinedIcon fontSize="small" />}
                      <strong style={{ fontSize: "14px" }}>{source.name}</strong>
                    </MDBox>

                    <SecureButton
                      buttonKey="/button/delete-data-source"
                      componentType="icon"
                      color="default"
                      size="small"
                      disabled={!source.isCompleted}
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDialog({ open: true, index });
                      }}
                    >
                      <DeleteOutlineOutlined fontSize="small" />
                    </SecureButton>
                  </MDBox>
                )}
              </AccordionSummary>

              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} mt={2}>
                    <FormControl fullWidth>
                      <InputLabel>Data Source Type</InputLabel>
                      <Select
                        value={source.type}
                        label="Data Source Type"
                        disabled={source.isCompleted}
                        onChange={(e) => {
                          const updated = [...dataSources];
                          updated[index].type = e.target.value;
                          setDataSources(updated);
                        }}
                        sx={{ height: "44px" }}
                      >
                        <MenuItem value="document">Document</MenuItem>
                        <MenuItem value="url">URL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    {source.type === "url" && (
                      <URLSourceForm
                        onUploadComplete={(data) => handleUploadComplete(index, data)}
                        isEditing={source.isCompleted}
                        dataSourceType={source.type}
                        dataSourceId={source._id}
                        name={source.name}
                        chunkingStrategy={source.chunk_strategy}
                        chunkSize={source.chunk_config?.chunk_size}
                        overlapSize={source.chunk_config?.chunk_overlap}
                        urls={source.urls}
                        matchPattern={source.urlConfig?.[0]?.crawling_config?.regex || ""}
                        recursionLimit={
                          source.urlConfig?.[0]?.crawling_config?.recursion_limit?.toString() || "5"
                        }
                        manualURLs={source.manualURLs}
                        uploadedURL={source.uploadedURL}
                        mode={source.mode}
                      />
                    )}
                    {source.type === "document" && (
                      <DocumentSourceForm
                        onUploadComplete={(data) => handleUploadComplete(index, data)}
                        isEditing={source.isCompleted}
                        name={source.name}
                        files={source.files}
                        dataSourceType={source.type}
                        dataSourceId={source._id}
                        chunkingStrategy={source.chunk_strategy}
                        chunkSize={source.chunk_config?.chunk_size}
                        overlapSize={source.chunk_config?.chunk_overlap}
                        existingKnowledgeBaseId={knowledgeBaseId}
                      />
                    )}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, index: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Data Source</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Are you sure you want to permanently delete{" "}
            <strong>{dataSources[confirmDialog.index]?.name || "this data source"}</strong>
            ?
            <br />
            <Typography component="span" variant="body2" color="error">
              This action cannot be undone.
            </Typography>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ pr: 3, pb: 2 }}>
          <MDButton
            onClick={() => setConfirmDialog({ open: false, index: null })}
            variant="outlined"
            color="secondary"
            size="small"
          >
            Cancel
          </MDButton>
          <MDButton onClick={confirmDelete} color="error" variant="contained" size="small">
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

KnowledgeBaseDataSourceAccordion.propTypes = {
  existingDataSources: PropTypes.array,
  existingKBId: PropTypes.string,
};

export default KnowledgeBaseDataSourceAccordion;
