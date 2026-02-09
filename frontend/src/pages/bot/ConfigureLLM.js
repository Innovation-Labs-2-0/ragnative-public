import React, { useEffect, useState } from "react";
import {
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDButton from "components/style-components/MDButton";
import PropTypes from "prop-types";
import SecureButton from "components/SecureButton";
import { getRequest, putRequest } from "utils/apiClient";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useBotContext } from "context/BotContext";

function ConfigureLLM({ onBack, onNext, isActive, onStepComplete }) {
  const [llm, setLlm] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [maxTokens, setMaxTokens] = useState("128000");
  const [chatModelsList, setChatModelsList] = useState([]);

  const { chatbotId } = useBotContext();

  const handleSubmit = async () => {
    const payload = {
      llm_to_be_used: llm,
      temperature: parseFloat(temperature),
      max_tokens: parseInt(maxTokens),
    };
    const response = await putRequest(`/bot/${chatbotId}`, payload);
    onStepComplete();
    onNext();
  };

  const getAllChatModels = async () => {
    try {
      const chatModels = await getRequest("/llms/llm_models", { model_type: "chat" });
      chatModels.map((item) => {
        item.label = `${item.name} (${item.model})`;
        item.value = item._id;
      });
      setChatModelsList(chatModels);
    } catch (error) {
      console.log("Error while fetching chat models", error);
    }
  };

  useEffect(() => {
    getAllChatModels();
  }, []);

  const getLLMConfig = async () => {
    try {
      const response = await getRequest(`/bot/${chatbotId}`);
      setLlm("" || response.llm_to_be_used);
      setTemperature("0.7" || response.temperature);
      setMaxTokens("128000" || response.max_tokens);
    } catch (error) {
      console.log("Error while getting existing llm config", error);
      setLlm("");
      setTemperature("0.7");
      setMaxTokens("128000");
    }
  };

  useEffect(() => {
    if (!isActive) {
      return;
    }

    getLLMConfig();
  }, [isActive, chatbotId]);

  return (
    <MDBox mt={1} p={2} display="flex" justifyContent="center" alignItems="center">
      <Grid container spacing={3} sm={6}>
        {/* Select LLM */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="llm-label">Select your LLM</InputLabel>
            <Select
              labelId="llm-label"
              value={llm}
              label="Select your LLM"
              onChange={(e) => setLlm(e.target.value)}
              sx={{ height: "44px" }}
            >
              <MenuItem value="" disabled>
                Select LLM
              </MenuItem>
              {chatModelsList.map((model) => (
                <MenuItem key={model.value} value={model.value}>
                  {model.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Temperature */}
        <Grid item xs={12}>
          <MDBox display="flex" alignItems="center" gap={1}>
            <TextField
              fullWidth
              label="Set Temperature"
              inputProps={{ min: 0, max: 1, step: 0.1 }}
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Tooltip
                    title={
                      <>
                        Controls randomness of outputs.
                        <br /> 0 = deterministic & focused, 1 = creative & varied
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
          </MDBox>
        </Grid>

        {/* Max Tokens */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Maximum Tokens (Optional)"
            value={maxTokens}
            onChange={(e) => setMaxTokens(e.target.value)}
            InputProps={{
              endAdornment: (
                <Tooltip
                  title={
                    <>
                      Maximum tokens the model can return in one response.
                      <br />
                      Includes both input + output tokens and must fit within the model’s context
                      window.
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

        {/* Buttons */}
        <Grid item xs={12}>
          <MDBox display="flex" justifyContent="flex-end" gap={2}>
            <MDButton variant="outlined" color="secondary" onClick={onBack} size="small">
              Back
            </MDButton>

            <SecureButton
              buttonKey="/button/configure-llm"
              variant="contained"
              color="primary"
              size="small"
              onClick={handleSubmit}
            >
              Save & Next
            </SecureButton>
          </MDBox>
        </Grid>
      </Grid>
    </MDBox>
  );
}

ConfigureLLM.propTypes = {
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  isActive: PropTypes.any,
  onStepComplete: PropTypes.func,
};

export default ConfigureLLM;
