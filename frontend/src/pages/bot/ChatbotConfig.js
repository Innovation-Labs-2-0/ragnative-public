import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  FormHelperText,
  Icon,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import MDBox from "components/style-components/MDBox";
import MDButton from "components/style-components/MDButton";
import PropTypes from "prop-types";
import { postRequest, putRequest, getRequest } from "utils/apiClient";
import SecureButton from "components/SecureButton";
import { useNavigate } from "react-router-dom";
import { useBotContext } from "context/BotContext";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { useKnowledgeBaseContext } from "context/KnowledgeBaseContext";
function ChatbotConfiguration({ onNext, isActive, onStepComplete }) {
  const [chatbotName, setChatbotName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("Hello! How can I assist you today?");
  const [tone, setTone] = useState("");
  const [chatbotNameError, setChatbotNameError] = useState(false);
  const [teamError, setTeamError] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert in assisting. Answer the user’s queries in the given context. If you do not have any context for the query, reply with “No context available”."
  );
  const [chatBotDescription, setChatbotDescription] = useState("");
  const [teamsList, setTeamsList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleAlert = (text, color, alertTime = null) => {
    const details = {
      color,
      text,
      icon: null,
    };
    if (color === "success") {
      details.icon = <VerifiedRoundedIcon color={color} fontSize="medium" />;
    } else {
      details.icon = <NewReleasesRoundedIcon color={color} fontSize="medium" />;
    }
    setNotificationDetails(details);
    setShowAlert(true);
    alertTime && setTimeout(() => setShowAlert(false), alertTime);
  };

  const { chatbotId, setBotId, setBotVersion, editMode, setActive, setIngestionComplete } =
    useBotContext();
  const { setKnowledgeBaseId } = useKnowledgeBaseContext();
  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  const handleTeamChange = (event) => {
    setSelectedTeam(event.target.value);
  };

  const handleSystemPromptChange = (event) => {
    setSystemPrompt(event.target.value);
  };

  const handleChatbotNameChange = (e) => {
    setChatbotName(e.target.value);
    if (chatbotNameError && e.target.value.trim()) {
      setChatbotNameError(false);
    }
  };

  const handleWelcomeMessageChange = (event) => {
    setWelcomeMessage(event.target.value);
  };

  const handleChatbotDescriptionChange = (event) => {
    setChatbotDescription(event.target.value);
  };

  const handleReset = () => {
    setChatbotName("");
    setWelcomeMessage("");
    setTone("");
    setSystemPrompt("");
    setChatbotDescription("");
    setSelectedTeam("");
  };

  const handleSaveAndNext = async () => {
    let hasError = false;

    if (!selectedTeam || selectedTeam === "") {
      setTeamError(true);
      hasError = true;
    } else {
      setTeamError(false);
    }

    if (!chatbotName.trim()) {
      setChatbotNameError(true);
      hasError = true;
    }

    if (hasError) return;

    setChatbotNameError(false);

    const payload = {
      name: chatbotName,
      welcome_message: welcomeMessage,
      persona: { tone: tone },
      system_prompt: systemPrompt,
      description: chatBotDescription,
      team: selectedTeam,
    };
    let response;
    if (chatbotId) {
      response = await putRequest(`/bot/${chatbotId}`, payload);
    } else {
      response = await postRequest("/bot/", payload);
      setBotId(response?.id);
      setBotVersion(response?.current_version);
    }
    if (response?.status == "error") {
      handleAlert(response?.message, response.status, 5000);
      return;
    }
    onStepComplete();
    onNext();
  };

  const fetchChatbotConfig = async () => {
    if (!isActive || !chatbotId) {
      return;
    }

    try {
      const response = await getRequest(`/bot/${chatbotId}`);
      setChatbotName(response.name);
      setWelcomeMessage(response.welcome_message);
      setTone(response.persona.tone);
      setSystemPrompt(response.system_prompt);
      setChatbotDescription(response.description);
      setSelectedTeam(response.team);
      setKnowledgeBaseId(response.knowledge_base);
      setActive(response.active);
      setIngestionComplete(response.ingestion_status === "completed");
    } catch (error) {
      console.error("Error fetching chatbot config:", error);
    }
  };

  useEffect(() => {
    fetchChatbotConfig();
  }, [isActive, chatbotId]);

  const fetchTeams = async () => {
    try {
      const response = await getRequest("/teams/user-teams");
      const allTeamsList = response.map((item) => {
        item.label = item.name;
        item.value = item._id;
        return item;
      });
      setTeamsList(allTeamsList);
    } catch (error) {
      console.log("Error while fetching teams", error);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <MDBox mt={1.5} p={2}>
      <Grid container spacing={2}>
        <Grid xs={12} pl={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                error={chatbotNameError}
                helperText={chatbotNameError ? "Chatbot name is required" : ""}
                label="Chatbot Name"
                placeholder="Provide a name for your chatbot"
                value={chatbotName}
                onChange={(e) => handleChatbotNameChange(e)}
                disabled={editMode}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={2}
                value={chatBotDescription}
                onChange={(e) => handleChatbotDescriptionChange(e)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Welcome Message"
                multiline
                rows={2}
                value={welcomeMessage}
                onChange={(e) => handleWelcomeMessageChange(e)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={teamError}>
                <InputLabel id="select-team-label" shrink={Boolean(selectedTeam)}>
                  Select Team *
                </InputLabel>
                <Select
                  required
                  labelId="select-team-label"
                  value={selectedTeam ?? ""}
                  label="Select Team"
                  placeholder="Select Team"
                  onChange={(e) => {
                    handleTeamChange(e);
                    if (teamError) setTeamError(false);
                  }}
                  sx={{ height: "45px" }}
                >
                  <MenuItem value="" disabled>
                    Select team
                  </MenuItem>
                  {teamsList.map((team) => (
                    <MenuItem value={team.value} key={team.value}>
                      {team.label}
                    </MenuItem>
                  ))}
                </Select>

                {teamError && <FormHelperText>Team selection is required</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="tone-select-label">Select a Tone</InputLabel>
                <Select
                  labelId="tone-select-label"
                  value={tone}
                  label="Select a Tone"
                  placeholder="Select a Tone"
                  onChange={(e) => handleToneChange(e)}
                  sx={{
                    height: "45px",
                  }}
                >
                  <MenuItem value="">Select a tone</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                  <MenuItem value="Casual">Casual</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="System Prompt"
                multiline
                rows={4}
                value={systemPrompt}
                onChange={(e) => handleSystemPromptChange(e)}
              />
            </Grid>
            <Grid item xs={12}>
              {showAlert && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    maxWidth: "550px",
                  }}
                >
                  <Icon fontSize="medium">{notificationDetails?.icon}</Icon>
                  <Typography
                    sx={{
                      marginLeft: "5px",
                      fontSize: "0.93rem",
                      textAlign: "right",
                      color: grey[600],
                    }}
                  >
                    {notificationDetails?.text}
                  </Typography>
                </div>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/manage-bots")}
                  size="small"
                >
                  Cancel
                </MDButton>
                <MDButton
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleReset()}
                  size="small"
                >
                  Reset
                </MDButton>

                <SecureButton
                  buttonKey="/button/create-chatbot"
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleSaveAndNext}
                >
                  Save & Next
                </SecureButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </MDBox>
  );
}

ChatbotConfiguration.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.any,
  onStepComplete: PropTypes.func,
};

export default ChatbotConfiguration;
