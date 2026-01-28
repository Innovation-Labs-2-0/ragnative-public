import { Modal, IconButton, Box, Typography, CircularProgress } from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { getRequest } from "utils/apiClient";
import RegisterLLMs from "./RegisterLLMs";

function EditLLM({ selectedLLM, onClose, fetchLLMsList }) {
  const [llmDetails, setLlmDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLLMDetails = async () => {
    try {
      setLoading(true);
      const response = await getRequest("/llms/get-llm", { llm_id: selectedLLM });
      setLlmDetails(response);
    } catch (error) {
      console.log("Error fetching LLM details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedLLM) getLLMDetails();
  }, [selectedLLM]);

  return (
    <Modal open={!!selectedLLM} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          width: 800,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Edit LLM</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="300px">
            <CircularProgress />
          </Box>
        ) : llmDetails ? (
          <RegisterLLMs
            initialData={llmDetails}
            isEdit={true}
            isModalMode={true}
            onClose={onClose}
            fetchLLMsList={fetchLLMsList}
          />
        ) : (
          <Typography variant="body2">No LLM data found.</Typography>
        )}
      </Box>
    </Modal>
  );
}

EditLLM.propTypes = {
  selectedLLM: PropTypes.string,
  onClose: PropTypes.func,
  fetchLLMsList: PropTypes.func,
};

export default EditLLM;
