import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Card,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  IconButton,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Icon,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDInput from "components/style-components/MDInput";
import MDButton from "components/style-components/MDButton";
import { postRequest, putRequest } from "../../utils/apiClient";
import { ContentCopy, Visibility, VisibilityOff, Refresh } from "@mui/icons-material";
import SecureButton from "components/SecureButton";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  p: 4,
  borderRadius: 2,
};

const UserModal = ({ open, onClose, onSuccess, userToEdit }) => {
  const isEditMode = Boolean(userToEdit);
  const initialFormData = {
    name: "",
    email: "",
    role: "user",
    password: "",
    active: true,
    teams: [],
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 8 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  const [formData, setFormData] = useState(initialFormData);
  const [allTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);

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

  useEffect(() => {
    if (isEditMode) {
      setFormData({
        name: userToEdit.name || "",
        email: userToEdit.email.toLowerCase() || "",
        role: userToEdit.role || "user",
        teams: [],
        active: !!userToEdit.active,
        last_login: userToEdit.last_login,
      });
    } else {
      setFormData((prev) => ({ ...prev, password: generatePassword() }));
    }
    setError(null);
    setShowAlert(false);
  }, [userToEdit, open, allTeams]);

  const handlePasswordRefresh = () => {
    setFormData((prev) => ({ ...prev, password: generatePassword() }));
    handleAlert("Password Refreshed", "success", 3000);
  };
  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(formData.password);
      handleAlert("Password copied to clipboard!", "success", 3000);
    } catch (err) {
      handleAlert("Failed to copy password to clipboard", "error");
    }
  };

  const handleFieldChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleRoleChange = (event) => {
    setFormData((prev) => ({ ...prev, role: event.target.value }));
  };
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSave = async () => {
    if (!validateEmail(formData.email)) {
      handleAlert("Please enter a valid email address", "error", 3000);
      return;
    }
    setLoading(true);
    setShowAlert(false);

    try {
      console.log("its id of user", userToEdit);
      let result;

      if (isEditMode) {
        const id = userToEdit.id;

        result = await putRequest(`/users/${id}`, {
          active: formData.active,
          name: formData.name,
          email: formData.email.toLowerCase(),
          role: formData.role,
          team_ids: formData.teams,
        });
      } else {
        result = await postRequest("/users/", {
          active: formData.active,
          name: formData.name,
          email: formData.email.toLowerCase(),
          password: formData.password,
          role: formData.role,
        });
      }
      if (result.status === "success") {
        handleAlert(result.message, "success", 3000);
        onSuccess();
        setTimeout(() => onClose(), 1000);
      } else {
        handleAlert(result.message || "Failed to save user", "error");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      handleAlert(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong, could not save user!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={false}
      slotProps={{
        backdrop: {
          onClick: (event) => {
            event.stopPropagation();
          },
        },
      }}
    >
      <Card sx={modalStyle}>
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium" mb={3}>
            {isEditMode ? "Edit User" : "Create New User"}
          </MDTypography>

          <Grid item xs={6} md={6} marginBottom={2} display="flex" justifyContent="flex-end" mb={2}>
            {showAlert && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  maxWidth: "550%",
                }}
              >
                <Icon fontSize="medium">{notificationDetails?.icon}</Icon>
                <Typography
                  sx={{
                    marginLeft: "5px",
                    fontSize: "0.93rem",
                    textAlign: "right",
                    color: notificationDetails?.color === "success" ? "success.main" : "error.main",
                    flexGrow: 1,
                  }}
                >
                  {notificationDetails?.text}
                </Typography>
              </div>
            )}
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                label="Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
                required
                disabled={isEditMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <MDInput
                fullWidth
                label="Email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleFieldChange}
                required
                disabled={isEditMode}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Select
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                sx={{ height: "45px" }}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
              </Select>
            </Grid>
            {!isEditMode && (
              <Grid item xs={12} sm={6}>
                <MDInput
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPassword((prev) => !prev)}>
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                        <IconButton size="small" onClick={handleCopyPassword}>
                          <ContentCopy />
                        </IconButton>
                        <IconButton size="small" onClick={handlePasswordRefresh}>
                          <Refresh />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            )}

            {isEditMode && (
              <Grid item xs={6}>
                <MDInput
                  fullWidth
                  label="Last Logged-in"
                  variant="outlined"
                  name="last_login"
                  value={
                    userToEdit.last_login
                      ? new Date(userToEdit.last_login).toLocaleString()
                      : "Never"
                  }
                  disabled={isEditMode}
                />
              </Grid>
            )}

            {isEditMode && (
              <Grid item xs={12} md={8} lg={14}>
                <Accordion sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Teams ({userToEdit?.teams?.length || 0})</Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    {userToEdit?.teams?.length > 0 ? (
                      <Stack direction="row" rowGap={2} spacing={2} flexWrap="wrap">
                        {userToEdit.teams.map((team, index) => {
                          const teamName = typeof team === "object" ? team.name : team; // ✔ SAME LOGIC
                          return (
                            <Chip
                              key={index}
                              label={teamName}
                              color="secondary"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          );
                        })}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Not assigned to any team
                      </Typography>
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <MDBox sx={{ display: "flex", alignItems: "center" }}>
                <MDTypography variant="subtitle2" sx={{ mr: 2 }}>
                  Active :
                </MDTypography>
                <ToggleButtonGroup
                  value={formData.active ? "yes" : "no"}
                  exclusive
                  onChange={(e, newValue) => {
                    if (newValue !== null) {
                      setFormData((prev) => ({ ...prev, active: newValue === "yes" }));
                    }
                  }}
                  size="small"
                >
                  <ToggleButton value="yes" sx={{ width: "60px" }}>
                    Yes
                  </ToggleButton>
                  <ToggleButton value="no" sx={{ width: "60px" }}>
                    No
                  </ToggleButton>
                </ToggleButtonGroup>
              </MDBox>
            </Grid>

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                <MDButton variant="outlined" color="secondary" onClick={onClose}>
                  Cancel
                </MDButton>
                <SecureButton
                  buttonKey="/button/create-user"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading || !formData.name || !formData.email}
                  startIcon={
                    loading && <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                  }
                >
                  {isEditMode ? "Save Changes" : "Create User"}
                </SecureButton>
              </Stack>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </Modal>
  );
};

UserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  userToEdit: PropTypes.object,
};

export default UserModal;
