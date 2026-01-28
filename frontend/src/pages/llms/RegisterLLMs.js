import React, { useState, useEffect } from "react";
import { postRequest, getRequest, patchRequest } from "../../utils/apiClient";
import {
  Card,
  Grid,
  MenuItem,
  Stack,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
  Icon,
  ToggleButtonGroup,
  ToggleButton,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDInput from "components/style-components/MDInput";
import MDButton from "components/style-components/MDButton";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../components/Navbars/DashboardNavbar";
import DynamicFields from "../../components/Forms/DynamicFields";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { grey } from "@mui/material/colors";
import SecureButton from "components/SecureButton";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const RegisterLLMs = ({
  initialData = null,
  isEdit = false,
  isModalMode = false,
  onClose,
  fetchLLMsList,
}) => {
  const llmTypes = ["Chat", "Embedding"];
  const [providersList, setProvidersList] = useState([]);
  const [providerConfigSchemas, setProviderConfigSchemas] = useState({});
  const [configSchemaData, setConfigSchemaData] = useState();
  const [currentConfigSchema, setCurrentConfigSchema] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [testDisabled, setTestDisabled] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [connSuccess, setConnSuccess] = useState();
  const [teamsList, setTeamsList] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      const normalizedTeams = initialData.teams?.map((team) => team.id) || [];
      const publicLlmValue = initialData.public_llm ? "yes" : "no";

      setFormData((prev) => ({
        ...prev,
        ...initialData,
        public_llm: publicLlmValue,
        // If public_llm is 'yes', teams should be empty or ignored, else set to normalizedTeams
        teams: publicLlmValue === "no" ? normalizedTeams : [],
        owner:
          initialData.owner && typeof initialData.owner === "object"
            ? initialData.owner.id
            : initialData.owner,
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData && configSchemaData) {
      handleConfigSchemaChange(initialData.type, configSchemaData);

      if (initialData.provider) {
        const schemasForType = configSchemaData[initialData.type];
        if (schemasForType && schemasForType.hasOwnProperty(initialData.provider)) {
          setCurrentConfigSchema(schemasForType[initialData.provider].fields);
        }
      }
    }
  }, [initialData, configSchemaData]);

  /**
   *
   * @param {*} text content of the alert
   * @param {*} color alert type, e.g., error, success, warning, etc.
   * @param {*} alertTime accepts time in seconds
   */
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

  const emptyForm = {
    name: "",
    provider: "",
    model: "",
    type: "chat",
    public_llm: "yes",
    teams: [],
    config: {},
    owner: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  const handleFieldChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  const handleConfigChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      config: { ...formData.config, [event.target.name]: event.target.value },
    }));
  };
  const handleConnection = (result) => {
    handleAlert(result.message, result.status);
    setConnSuccess(result.status === "success");
  };
  const handleLLMCreation = () => {
    setFormData(emptyForm);
    setCurrentConfigSchema(null);
    setConnSuccess(false);
    navigate("/manage-llms");
  };

  const handleProviderChange = (e) => {
    handleFieldChange(e);
    const provider = e.target.value;
    provider && changeConfigSchema(provider);
  };

  const changeConfigSchema = (provider, schemaData = null) => {
    const configSchemas = schemaData ? schemaData : providerConfigSchemas;
    if (configSchemas) {
      if (configSchemas.hasOwnProperty(provider)) {
        setCurrentConfigSchema(configSchemas[provider].fields);
      }
    } else {
      setCurrentConfigSchema(null);
    }
  };

  const fetchProvidersWithConfigs = async () => {
    try {
      const res = await getRequest("/llms/provider_schema_configs");
      if (res) {
        setConfigSchemaData(res);
        handleConfigSchemaChange(formData.type || initialData.type, res);
      }
    } catch (error) {
      handleAlert("Something went wrong, could not connect to the server!", "error");
      console.log(error);
    }
  };

  const handleTypeChange = (event) => {
    const type = event.target.value;
    handleConfigSchemaChange(type);
    handleFieldChange(event);
  };

  const handleConfigSchemaChange = (type, data = null) => {
    const schemaData = data ? data[type] : configSchemaData[type];
    const providerLabels = Object.keys(schemaData);
    const providerList = providerLabels.map((value) => ({
      label: schemaData[value].label,
      value,
    }));
    setProvidersList(providerList);
    setProviderConfigSchemas(schemaData);
    if (formData.provider && providerLabels.includes(formData.provider)) {
      changeConfigSchema(formData.provider, schemaData);
    } else {
      setCurrentConfigSchema(null);
    }
  };

  useEffect(() => {
    fetchProvidersWithConfigs();
  }, []); // onLoad

  useEffect(() => {
    setTestDisabled(false);
  }, [formData]);

  const handleSubmit = async () => {
    try {
      setShowAlert(false);
      setSaveDisabled(true);

      let result;

      if (isEdit) {
        result = await patchRequest(`/llms/${formData._id}`, formData);
      } else {
        result = await postRequest("/llms/", formData);
      }

      handleAlert(result.message, result.status, 5000);
      if (result.status === "success") {
        if (isModalMode) {
          onClose && onClose();
          fetchLLMsList && fetchLLMsList();
        } else {
          setTimeout(() => {
            navigate("/manage-llms");
          }, 5000);
        }
      }
    } catch (error) {
      handleAlert(
        error?.first_error ||
          error?.message ||
          "Something went wrong, could not connect to the server!",
        "error"
      );
      console.log(error);
    } finally {
      setSaveDisabled(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setShowAlert(false);
      setTestDisabled(true);
      const testResult = await postRequest("/llms/test", formData);
      handleConnection(testResult);
    } catch (e) {
      handleAlert(
        e?.first_error || e?.message || "Something went wrong, could not connect to the server!",
        "error"
      );
      console.log("Error while checking connection", e);
    } finally {
      setTestDisabled(false);
    }
  };

  const handleTogglePublicLLM = (event, value) => {
    if (value !== null) {
      setFormData((prev) => ({
        ...prev,
        public_llm: value,
        teams: value === "yes" ? prev.teams : [],
      }));
    }
  };

  const handleTeamsChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      teams: typeof e.target.value === "string" ? e.target.value.split(",") : e.target.value,
    }));
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/manage-llms");
    }
    setFormData(emptyForm);
  };

  const getTeams = async () => {
    try {
      const response = await getRequest("/teams/user-teams");
      const allTeamsList = response.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      setTeamsList(allTeamsList);
    } catch (error) {
      console.log("Error while getting teams", error);
    }
  };

  useEffect(() => {
    getTeams();
  }, []);

  const renderRegisterForm = () => {
    return (
      <>
        <MDTypography variant="h5" fontWeight="medium" mb={2}>
          {isModalMode ? "" : "Register LLM"}
        </MDTypography>

        <Grid item xs={6} md={6} marginBottom={2} display="flex" justifyContent="flex-end" mb={2}>
          {showAlert && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
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
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <MDInput
              fullWidth
              label="LLM Name"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleFieldChange}
              success={connSuccess}
              required
              placeholder="Provide a custom name for LLM"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel id="llm-type-label" required>
                LLM Type
              </InputLabel>
              <Select
                labelId="llm-type-label"
                label="LLM Type"
                sx={{
                  height: "45px",
                }}
                value={formData.type}
                name="type"
                onChange={handleTypeChange}
              >
                {llmTypes.map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" sx={{ width: "100%" }}>
              <InputLabel id="llm-provider-label" required>
                LLM Provider Name
              </InputLabel>
              <Select
                labelId="llm-provider-label"
                label="LLM Provider Name"
                sx={{
                  height: "45px",
                }}
                value={formData.provider}
                name="provider"
                onChange={handleProviderChange}
              >
                {providersList.map((provider) => (
                  <MenuItem key={`key_${provider.value}`} value={provider.value}>
                    {provider.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <MDInput
              fullWidth
              label="Model Name"
              variant="outlined"
              name="model"
              value={formData.model}
              onChange={handleFieldChange}
              placeholder="e.g., gpt-4o, gemini-2.5-pro"
              required
            />
          </Grid>
          {currentConfigSchema && (
            <DynamicFields
              configSchema={currentConfigSchema}
              formData={formData.config}
              onChange={handleConfigChange}
            />
          )}

          <Grid item xs={12} md={6}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ToggleButtonGroup
                size="small"
                exclusive
                value={formData.public_llm}
                onChange={(e, value) => handleTogglePublicLLM(e, value)}
                aria-label="Public LLM"
                sx={{ height: "45px" }}
              >
                <ToggleButton value="yes" sx={{ height: "45px", px: 4 }}>
                  Yes
                </ToggleButton>
                <ToggleButton
                  value="no"
                  sx={{
                    height: "45px",
                    px: 4,
                  }}
                >
                  No
                </ToggleButton>
              </ToggleButtonGroup>
              <MDTypography variant="subtitle2" sx={{ fontSize: "14px" }}>
                Allow Public Access To All Teams
              </MDTypography>
            </Stack>
          </Grid>
          {formData.public_llm === "no" && (
            <Grid item xs={12} md={6}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="team-label" required>
                  Select Teams
                </InputLabel>
                <Select
                  labelId="team-label"
                  id="team-multi-chip"
                  multiple
                  value={formData.teams}
                  onChange={(e) => handleTeamsChange(e)}
                  input={<OutlinedInput id="select-multiple-chip" label="Select Teams" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((teamId) => {
                        const team = teamsList.find((t) => t.value === teamId);
                        return <Chip key={teamId} label={team?.label || teamId} />;
                      })}
                    </Box>
                  )}
                  sx={{ height: "45px" }}
                >
                  {teamsList.map((team) => (
                    <MenuItem key={team.value} value={team.value}>
                      {team.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12}>
            <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
              <SecureButton
                buttonKey="/button/test-llm-connection"
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleTestConnection}
                disabled={testDisabled}
                startIcon={
                  testDisabled ? (
                    <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                  ) : null
                }
              >
                Test Connection
              </SecureButton>

              <MDButton variant="contained" color="secondary" size="small">
                Cancel
              </MDButton>

              <SecureButton
                buttonKey="/button/register-llm"
                variant="contained"
                color="primary"
                size="small"
                onClick={handleSubmit}
                disabled={saveDisabled}
                startIcon={
                  saveDisabled ? (
                    <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                  ) : null
                }
              >
                {isModalMode ? "Update LLM" : "Save LLM"}
              </SecureButton>
            </Stack>
          </Grid>
        </Grid>
      </>
    );
  };

  return isModalMode ? (
    renderRegisterForm()
  ) : (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={2} mb={0}>
        <Card sx={{ padding: 4, maxWidth: 900, mx: "auto" }}>{renderRegisterForm()}</Card>
      </MDBox>
    </DashboardLayout>
  );
};

RegisterLLMs.propTypes = {
  initialData: PropTypes.object,
  isEdit: PropTypes.bool,
  onClose: PropTypes.func,
  isModalMode: PropTypes.bool,
  fetchLLMsList: PropTypes.func,
};

export default RegisterLLMs;
