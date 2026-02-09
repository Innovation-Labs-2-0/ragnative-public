import React, { useState, useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  CircularProgress,
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MDBox from "components/style-components/MDBox";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDButton from "components/style-components/MDButton";
import MDTypography from "components/style-components/MDTypography";
import MDAlert from "components/style-components/MDAlert";
import { getRequest } from "utils/apiClient";
import profileImg from "assets/images/profile.png";
import ChangePasswordModal from "components/Modals/ChangePasswordModal";

const Profile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success] = useState(null);

  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRequest("/users/profile");
        if (response && response.name) {
          setName(response.name);
          setEmail(response.email);
          setRole(response.role);
          setTeams(response.team_names || []);
        } else {
          setError("Invalid profile data received from server.");
        }
      } catch (error) {
        setError("Failed to fetch user profile", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  const renderContent = () => {
    if (loading) {
      return (
        <MDBox display="flex" justifyContent="center" alignItems="center" p={3} minHeight="50vh">
          <CircularProgress />
        </MDBox>
      );
    }

    if (error) {
      return (
        <MDBox p={3}>
          <MDAlert color="error" dismissible onClose={() => setError(null)}>
            {error}
          </MDAlert>
        </MDBox>
      );
    }

    return (
      <>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={8} lg={9}>
            <Card sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
                  <Box
                    component="img"
                    src={profileImg}
                    alt="Profile"
                    borderRadius="50%"
                    width="150px"
                    height="150px"
                    mx="auto"
                  />
                  <MDTypography variant="h6" mt={1}>
                    {name}
                  </MDTypography>
                </Grid>

                <Grid item xs={12} md={8}>
                  {success && (
                    <MDBox mb={3}>
                      <MDAlert color="success">{success}</MDAlert>
                    </MDBox>
                  )}

                  <MDBox mb={2}>
                    <MDTypography variant="h5" fontWeight="bold">
                      Name: {name}
                    </MDTypography>
                    <MDTypography variant="body2" color="secondary">
                      Role: {role}
                    </MDTypography>
                    <MDTypography variant="body2" color="secondary">
                      Email: {email}
                    </MDTypography>
                  </MDBox>

                  <MDBox mt={10} display="flex" justifyContent="flex-end">
                    <MDButton
                      variant="contained"
                      color="primary"
                      onClick={handleOpenChangePassword}
                    >
                      Change Password
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={8} lg={9}>
            <Accordion sx={{ borderRadius: 2, boxShadow: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Teams ({teams.length})</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {teams.length > 0 ? (
                  <Stack direction="row" rowGap={2} spacing={3} flexWrap="wrap">
                    {teams.map((team, index) => (
                      <Chip
                        key={index}
                        label={team}
                        color="secondary"
                        variant="outlined"
                        sx={{ fontWeight: 500, m: 5 }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Not assigned to any team
                  </Typography>
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <ChangePasswordModal open={openChangePassword} onClose={handleCloseChangePassword} />
      </>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        {renderContent()}{" "}
      </MDBox>
    </DashboardLayout>
  );
};

export default Profile;
