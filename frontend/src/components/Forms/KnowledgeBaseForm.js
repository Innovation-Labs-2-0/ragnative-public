import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDButton from "components/style-components/MDButton";
import DataSources from "../../pages/bot/DataSourcesAccordion";
import { getRequest, postRequest, patchRequest } from "utils/apiClient";
import SecureButton from "components/SecureButton";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";

/**
 * A self-contained component for creating or editing a Knowledge Base.
 * It handles its own state, validation, and API calls.
 *
 * @param {string} mode - 'create' or 'edit'. Determines the component's behavior.
 * @param {string} [botId] - Required if mode is 'create'.
 * @param {function} onSaveSuccess - Callback function that receives the KB ID on successful creation/update.
 * @param {function} [onNext] - Callback for the "Save & Next" button, typically used in a wizard flow.
 * @param {function} [onBack] - Callback for the "Back" button, typically used in a wizard flow.
 */
function KnowledgeBaseForm({
  mode,
  botId,
  onSaveSuccess,
  onNext,
  onBack,
  onStepComplete,
  isActive,
}) {
  const [kbName, setKbName] = useState("");
  const [embeddingModel, setEmbeddingModel] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({ kbName: false, embeddingModel: false });
  const [embeddingModelsList, setEmbeddingModelsList] = useState([]);
  const [noEmbeddingModels, setNoEmbeddingModels] = useState(false);
  const [existingDataSources, setExistingDataSources] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(mode === "edit");
  const [showDataSources, setShowDataSources] = useState(mode === "edit");
  const { kbId: currentKbId, setKnowledgeBaseId: setCurrentKbId } = useKnowledgeBaseContext();

  useEffect(() => {
    const getEmbeddingModels = async () => {
      try {
        const response = await getRequest("/llms/llm_models", { model_type: "embedding" });
        if (!Array.isArray(response) || response.length === 0) {
          setNoEmbeddingModels(true);
          return;
        }
        const processed = response.map((item) => ({
          label: `${item.name} (${item.model})`,
          value: item._id,
        }));
        setEmbeddingModelsList(processed);
      } catch (error) {
        console.error("Error while fetching embedding models", error);
        setNoEmbeddingModels(true);
      }
    };
    getEmbeddingModels();
  }, []);

  const fetchKBData = async () => {
    if (mode !== "edit" || !currentKbId || !isActive) return;
    setIsDataLoading(true);
    try {
      const response = await getRequest(`/knowledge_base/${currentKbId}`);
      if (response) {
        const { kb, data_sources } = response;
        setKbName(kb.name || "");
        setEmbeddingModel(kb.embedding_model?.id || "");
        setDescription(kb.description || "");
        setExistingDataSources(data_sources || []);
      }
    } catch (error) {
      console.error("Failed to fetch Knowledge Base data.", error);
    } finally {
      setIsDataLoading(false);
    }
  };

  // Fetch existing KB data if in 'edit' mode
  useEffect(() => {
    fetchKBData();
  }, [mode, currentKbId, isActive]);

  const validateForm = () => {
    const isKbNameValid = kbName.trim() !== "";
    const isEmbeddingModelValid = embeddingModel !== "";
    const newErrors = {
      kbName: !isKbNameValid,
      embeddingModel: !isEmbeddingModelValid,
    };
    setErrors(newErrors);
    return isKbNameValid && isEmbeddingModelValid;
  };

  const handleProceed = async () => {
    if (!validateForm()) return;

    const payload = {
      name: kbName,
      embedding_model: embeddingModel,
      description: description,
      bot_id: botId,
    };

    try {
      const response = await postRequest("/knowledge_base/", payload);
      setCurrentKbId(response.id);
      setShowDataSources(true);
      onSaveSuccess(response.id); // Notify parent of the new ID
    } catch (error) {
      console.error("Error creating Knowledge Base:", error);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload = {
      name: kbName,
      embedding_model: embeddingModel,
      description: description,
    };

    try {
      const response = await patchRequest(`/knowledge_base/update/${currentKbId}`, payload);
      if (onNext) {
        onNext();
        onStepComplete();
      } else {
        onSaveSuccess(response);
      }
    } catch (error) {
      console.error("Error updating Knowledge Base:", error);
    }
  };

  if (isDataLoading) {
    return <MDBox p={2}>Loading Knowledge Base...</MDBox>;
  }

  return (
    <MDBox p={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Knowledge Base Name"
            value={kbName}
            required
            error={errors.kbName}
            helperText={errors.kbName ? "Knowledge Base Name is required" : ""}
            onChange={(e) => setKbName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required error={errors.embeddingModel}>
            <InputLabel>Embedding Model</InputLabel>
            <Select
              value={embeddingModel}
              label="Embedding Model"
              onChange={(e) => setEmbeddingModel(e.target.value)}
              sx={{ height: "44px" }}
              disabled={noEmbeddingModels}
            >
              {embeddingModelsList.map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
            {errors.embeddingModel && <FormHelperText>Embedding Model is required</FormHelperText>}
            {noEmbeddingModels && <FormHelperText>No embedding models found.</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        {showDataSources && (
          <Grid item xs={12} mt={1}>
            <DataSources existingDataSources={existingDataSources} existingKBId={currentKbId} />
          </Grid>
        )}

        {/* --- Action Buttons --- */}
        <Grid item xs={12}>
          <MDBox display="flex" justifyContent="flex-end" gap={2} mt={2}>
            {onBack && (
              <MDButton variant="outlined" color="secondary" onClick={onBack} size="small">
                Back
              </MDButton>
            )}

            {mode === "create" && !showDataSources && (
              <SecureButton
                buttonKey="/button/proceed-knowledgebase"
                variant="contained"
                color="primary"
                onClick={handleProceed}
                size="small"
              >
                Proceed
              </SecureButton>
            )}

            {showDataSources && (
              <SecureButton
                buttonKey="/button/save-knowledgebase"
                variant="contained"
                color="primary"
                onClick={handleSave}
                size="small"
              >
                {onNext ? "Save & Next" : "Save Changes"}
              </SecureButton>
            )}
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

KnowledgeBaseForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]).isRequired,
  botId: PropTypes.string,
  onSaveSuccess: PropTypes.func.isRequired,
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  onStepComplete: PropTypes.func,
  isActive: PropTypes.any,
};

export default KnowledgeBaseForm;
