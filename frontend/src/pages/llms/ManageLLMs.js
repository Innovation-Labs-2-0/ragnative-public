import React, { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDTypography from "components/style-components/MDTypography";
import DynamicCard from "components/Cards/DynamicCard/DynamicCard";
import { getRequest } from "utils/apiClient";
import Add from "@mui/icons-material/Add";
import MDButton from "components/style-components/MDButton";
import PROVIDER_ICON_MAP from "utils/iconProviderMap";
import { useNavigate } from "react-router-dom";
import EditLLM from "./EditLLM";
import { DynamicCardContext } from "context/DynamicCardContext";
import SearchIcon from "@mui/icons-material/Search";
import MDBox from "components/style-components/MDBox";

function ManageLLMs() {
  const [llms, setLLms] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedLLMId, setSelectedLLMId] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const expandedCardState = { activeCard, setActiveCard };
  const navigate = useNavigate();

  const visibleLLMs = llms.slice(0, visibleCount);

  const fetchLLMs = async () => {
    try {
      const response = await getRequest("/llms/all-llms");
      setLLms(response);
    } catch (error) {
      console.log("Error while fetching LLMs:", error);
    }
  };

  useEffect(() => {
    fetchLLMs();
  }, []);

  const handleViewLLM = (selectedLLM) => {
    setSelectedLLMId(selectedLLM);
  };

  const handleRegisterLLM = () => {
    navigate("/register-llms");
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
        <MDTypography variant="h5" fontWeight="medium">
          Manage LLMs
        </MDTypography>

        <MDButton
          variant="contained"
          color="primary"
          onClick={handleRegisterLLM}
          startIcon={<Add />}
        >
          Register
        </MDButton>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {visibleLLMs.map((llm) => (
          <Grid item xs={12} sm={6} md={4} key={llm.id}>
            <DynamicCardContext.Provider value={expandedCardState}>
              <DynamicCard
                id={llm.id}
                title={llm.name}
                subheader={llm.provider.toUpperCase()}
                headerIcon={
                  PROVIDER_ICON_MAP[llm.provider.toLowerCase()] || PROVIDER_ICON_MAP.default
                }
                mainFields={{
                  layout: "grid",
                  fields: [{ label: "Model", value: llm.model }],
                }}
                defaultActions={
                  llm.is_owner
                    ? {
                        edit: { enabled: true, onClick: () => handleViewLLM(llm.id) },
                      }
                    : {
                        view: { enabled: true, onClick: () => handleViewLLM(llm.id) },
                      }
                }
                createdAt={{
                  enabled: true,
                  date: new Date(llm.created_at).toISOString().slice(0, 19).replace("T", " "),
                }}
                expandableConfig={{
                  enabled: true,
                  layout: "grid",
                  fields: [
                    { label: "LLM Type ", value: llm.type === "chat" ? "Chat" : "Embedding" },
                    { label: "Owner ", value: llm.owner.name },
                    { label: "Public ", value: llm.public_llm ? "Yes" : "No" },
                    { label: "Active ", value: llm.active ? "Yes" : "No" },
                  ],
                }}
              />
            </DynamicCardContext.Provider>
          </Grid>
        ))}
      </Grid>

      {/* Show More button */}
      {visibleLLMs.length < llms.length && (
        <Box display="flex" justifyContent="center" mt={2}>
          <MDTypography
            variant="body2"
            color="primary"
            sx={{ cursor: "pointer", fontWeight: "medium" }}
            onClick={() => setVisibleCount((prev) => prev + 3)}
          >
            Show More...
          </MDTypography>
        </Box>
      )}

      {visibleLLMs.length === 0 && (
        <MDBox display="flex" flexDirection="column" alignItems="center" mt={5}>
          <SearchIcon fontSize="large" color="disabled" />
          <MDTypography variant="body1" color="textSecondary" mt={1}>
            No LLMs found. Please register a LLM.
          </MDTypography>
        </MDBox>
      )}

      {selectedLLMId && (
        <EditLLM
          selectedLLM={selectedLLMId}
          onClose={() => setSelectedLLMId("")}
          fetchLLMsList={fetchLLMs}
          isOwner={llms.find((llm) => llm.id === selectedLLMId)?.is_owner}
        ></EditLLM>
      )}
    </DashboardLayout>
  );
}

export default ManageLLMs;
