import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MDBox from "components/style-components/MDBox";
import KnowledgeBaseForm from "../../components/Forms/KnowledgeBaseForm";
import { Card, Grid } from "@mui/material";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NewReleasesRoundedIcon from "@mui/icons-material/NewReleasesRounded";
import { Icon, Typography, colors } from "@mui/material";
import { KnowledgeBaseContext } from "context/KnowledgeBaseContext";

const grey = colors.grey;
function ViewKnowledgeBase() {
  const { knowledgeBaseId } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [notificationDetails, setNotificationDetails] = useState(null);
  const [kbId, setKnowledgeBaseId] = useState(knowledgeBaseId);
  const knowledgeBaseState = {
    kbId,
    setKnowledgeBaseId,
  };
  /**
   *
   * @param {*} text content of the alert
   * @param {*} color alert type, e.g., error, success, warning, etc.
   * @param {*} alertTime accepts time in seconds
   */
  const handleAlert = (text, color, alertTime = 5000) => {
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

  const handleSaveSuccess = (result) => {
    if (result.status === "success") {
      handleAlert(
        "Knowledge Base updated successfully. Please ingest the knowledge base again!",
        "success",
        5000
      );
    } else {
      handleAlert(result.message, result.status);
    }

    setTimeout(() => {
      navigate("/knowledge-bases");
    }, 5000);
  };

  const handleBack = () => {
    navigate("/knowledge-bases");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar routes={["View Knowledge Base"]} />
      <MDBox mt={2}>
        <Card sx={{ maxWidth: 1000, margin: "0 auto", fontSize: "12px" }}>
          <MDBox p={3}>
            <Grid
              item
              xs={6}
              md={6}
              marginBottom={2}
              display="flex"
              justifyContent="flex-end"
              mb={2}
              pr={2}
            >
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
            <KnowledgeBaseContext.Provider value={knowledgeBaseState}>
              <KnowledgeBaseForm
                mode="edit"
                knowledgeBaseId={knowledgeBaseId}
                onSaveSuccess={handleSaveSuccess}
                onBack={handleBack}
                isActive={true}
              />
            </KnowledgeBaseContext.Provider>
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
}

export default ViewKnowledgeBase;
