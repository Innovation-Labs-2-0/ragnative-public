import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Card,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Box,
  Stack,
  Grid,
  Icon,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";

import MDBox from "components/style-components/MDBox";
import MDButton from "components/style-components/MDButton";
import { postRequest } from "utils/apiClient";
import { logoutSuccess } from "slices/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SecureButton from "components/SecureButton";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  p: 4,
  borderRadius: 2,
};

const validatePassword = (password) => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    digit: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
};

const ChangePasswordModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);

  const [validations, setValidations] = useState({});

  const handleAlert = (text, color, alertTime = null) => {
    const details = {
      color,
      text,
      icon:
        color === "success" ? (
          <VerifiedRoundedIcon color={color} fontSize="medium" />
        ) : (
          <NewReleasesRoundedIcon color={color} fontSize="medium" />
        ),
    };
    setNotificationDetails(details);
    setShowAlert(true);
    alertTime && setTimeout(() => setShowAlert(false), alertTime);
  };

  useEffect(() => {
    setValidations(validatePassword(newPassword));
  }, [newPassword]);

  useEffect(() => {
    if (open) {
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowAlert(false);
      setNotificationDetails(null);
      setValidations({});
    }
  }, [open]);

  const handleChangePasswordLogout = async () => {
    try {
      await postRequest("/auth/logout", {});
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logoutSuccess());
      onClose();
      navigate("/authentication/sign-in");
    }
  };

  const handleChangePassword = async () => {
    setShowAlert(false);

    if (!password || !newPassword || !confirmPassword) {
      handleAlert("Please fill in all fields.", "error", 5000);
      return;
    }

    if (newPassword !== confirmPassword) {
      handleAlert("New password and confirm password do not match.", "error", 5000);
      return;
    }

    if (password === newPassword) {
      handleAlert(
        "New password cannot be the same as current password. Please enter a different password.",
        "error",
        5000
      );
      return;
    }

    const isValid = Object.values(validatePassword(newPassword)).every(Boolean);
    if (!isValid) {
      handleAlert("Password does not meet requirements.", "error", 5000);
      return;
    }

    try {
      const response = await postRequest("/users/change-password", {
        old_password: password,
        new_password: newPassword,
      });

      if (response.status === "success") {
        handleAlert("Password updated successfully!", "success", 3000);
        setPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          handleChangePasswordLogout();
        }, 2000);
      } else {
        handleAlert("Failed to change password", "error", 5000);
      }
    } catch (err) {
      handleAlert(err.message || "An unexpected error occurred", "error", 3000);
    }
  };

  const getNextValidationMessage = (password) => {
    if (!password) return null;

    if (password.length < 8) return "At least 8 characters";
    if (!/[A-Z]/.test(password)) return "At least 1 uppercase letter";
    if (!/[a-z]/.test(password)) return "At least 1 lowercase letter";
    if (!/[0-9]/.test(password)) return "At least 1 digit";
    if (!/[^A-Za-z0-9]/.test(password)) return "At least 1 special character";

    return null;
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
          <Typography variant="h6" mb={2}>
            Change Password
          </Typography>

          <Grid item xs={12} marginBottom={2} display="flex" justifyContent="flex-end" mb={2}>
            {showAlert && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                  maxWidth: "100%",
                  width: "100%",
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

          <TextField
            margin="normal"
            fullWidth
            label="Old Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            fullWidth
            label="New Password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ mt: 1, mb: 2 }}>
            {newPassword && (
              <Typography
                variant="caption"
                color={getNextValidationMessage(newPassword) ? "error.main" : "success.main"}
              >
                {getNextValidationMessage(newPassword) || "✔ Password meets all requirements"}
              </Typography>
            )}
          </Box>

          <TextField
            margin="normal"
            fullWidth
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
            <MDButton variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </MDButton>
            <SecureButton
              buttonKey="/button/change-password"
              variant="contained"
              color="primary"
              onClick={handleChangePassword}
            >
              Change Password
            </SecureButton>
          </Stack>
        </MDBox>
      </Card>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChangePasswordModal;
