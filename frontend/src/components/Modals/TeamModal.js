import React, { useState, useEffect } from "react";
import { getRequest, postRequest, putRequest } from "../../utils/apiClient";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";

import {
  Modal,
  Card,
  Grid,
  Stack,
  Autocomplete,
  TextField,
  Chip,
  CircularProgress,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDInput from "components/style-components/MDInput";
import MDButton from "components/style-components/MDButton";
import MDAlert from "components/style-components/MDAlert";
import SecureButton from "components/SecureButton";
const cardStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 700,
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const TeamModal = ({ open, onClose, onSuccess, teamToEdit, currentUserId }) => {
  const isEditMode = Boolean(teamToEdit);
  const initialFormData = { name: "", members: [] };
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormData);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (open) {
        setUserSearchLoading(true);
        try {
          const users = await getRequest("/users/");
          setAllUsers(users || []);
        } catch (err) {
          setError("Failed to load users. Please try again.");
          console.error(err);
        } finally {
          setUserSearchLoading(false);
        }
      }
    };
    fetchAllUsers();
  }, [open]);

  useEffect(() => {
    if (isEditMode && teamToEdit && allUsers.length > 0) {
      const currentMemberIds = new Set(teamToEdit.members.map((member) => member.id));
      const memberObjects = allUsers.filter((user) => currentMemberIds.has(user._id));
      setFormData({
        name: teamToEdit.name,
        members: memberObjects,
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
  }, [teamToEdit, open, allUsers]);

  const handleFieldChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleMembersChange = (event, newMembers) => {
    setFormData((prev) => ({ ...prev, members: newMembers }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const memberIds = formData.members.map((member) => member._id);
      if (isEditMode) {
        if (formData.name !== teamToEdit.name) {
          await putRequest(`/teams/${teamToEdit.id}`, { name: formData.name });
        }
        await putRequest(`/teams/${teamToEdit.id}/members`, { member_ids: memberIds });
      } else {
        if (!currentUserId) {
          throw new Error("Current user ID is required to create a team.");
        }
        const createPayload = { name: formData.name, owner_id: currentUserId };
        const newTeam = await postRequest("/teams/", createPayload);

        if (memberIds.length > 0) {
          await putRequest(`/teams/${newTeam._id}/members`, { member_ids: memberIds });
        }
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.detail || "An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card sx={cardStyle}>
        <MDBox>
          <MDTypography variant="h5" fontWeight="medium" mb={3}>
            {isEditMode ? "Edit Team" : "Create New Team"}
          </MDTypography>

          {error && (
            <MDAlert color="error" sx={{ mb: 2 }}>
              {error}
            </MDAlert>
          )}

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MDInput
                fullWidth
                label="Team Name"
                variant="outlined"
                name="name"
                value={formData.name}
                onChange={handleFieldChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                id="team-members-autocomplete"
                options={allUsers}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                value={formData.members}
                onChange={handleMembersChange}
                loading={userSearchLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Team Members"
                    placeholder="Search for users..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {userSearchLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      key={option._id}
                      variant="outlined"
                      label={option.name}
                      {...getTagProps({ index })}
                      disabled={isEditMode && option._id === teamToEdit.owner.id}
                    />
                  ))
                }
              />
            </Grid>

            {isEditMode && (
              <Grid item xs={12}>
                {teamToEdit.bots && teamToEdit.bots.length > 0 ? (
                  <>
                    <MDTypography variant="h5" fontWeight="medium">
                      Associated Bots
                    </MDTypography>
                    <TableContainer
                      variant="outlined"
                      color="primary"
                      sx={{
                        maxHeight: 200,
                        overflow: "auto",
                        borderRadius: "2px",
                        boxShadow: 0,
                      }}
                    >
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <MDTypography
                                variant="h6"
                                fontWeight="medium"
                                sx={{
                                  verticalAlign: "middle",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                Bot Name
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <MDTypography
                                variant="subtitle1"
                                sx={({ typography: { h6 } }) => ({
                                  ...h6,
                                  verticalAlign: "middle",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                })}
                              >
                                Created at
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                          {teamToEdit.bots &&
                            teamToEdit.bots.length > 0 &&
                            teamToEdit.bots.map((bot) => (
                              <TableRow key={bot.id}>
                                <TableCell>
                                  <MDTypography
                                    variant="subtitle1"
                                    sx={({ typography: { size } }) => ({
                                      fontSize: size.sm,
                                      verticalAlign: "middle",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    })}
                                  >
                                    {bot.name}
                                  </MDTypography>
                                </TableCell>
                                <TableCell>
                                  <MDTypography
                                    variant="subtitle1"
                                    sx={({ typography: { size } }) => ({
                                      fontSize: size.sm,
                                      verticalAlign: "middle",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    })}
                                  >
                                    {bot.created_at}
                                  </MDTypography>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <MDTypography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ py: 1, textAlign: "left" }}
                  >
                    No bots associated with this team.
                  </MDTypography>
                )}
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
                <MDButton variant="outlined" color="secondary" onClick={onClose}>
                  Cancel
                </MDButton>
                <SecureButton
                  buttonKey="/button/create-team"
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  disabled={loading || !formData.name}
                  startIcon={
                    loading && <CircularProgress color="inherit" size={20} sx={{ mr: 1 }} />
                  }
                >
                  {isEditMode ? "Save Changes" : "Create Team"}
                </SecureButton>
              </Stack>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </Modal>
  );
};

TeamModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  teamToEdit: PropTypes.object,
  currentUserId: PropTypes.string,
};

export default TeamModal;
