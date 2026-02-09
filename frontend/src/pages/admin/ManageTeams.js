import React, { useState, useEffect, useMemo } from "react";
import { getRequest } from "../../utils/apiClient";
import { Card, CircularProgress, Tooltip } from "@mui/material";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "components/style-components/MDBox";
import MDAlert from "components/style-components/MDAlert";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DataTable from "components/Tables/DataTable";
import TeamModal from "components/Modals/TeamModal";
import SecureButton from "components/SecureButton";

const ManageTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [teamToEdit, setTeamToEdit] = useState(null);

  // Replace with actual user ID from your auth context
  const currentUserId = "68afdcfcbfb9751c8b38fa22";

  const fetchOwnedTeams = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequest("/teams/");
      setTeams(response || []);
    } catch (err) {
      setError("Failed to load teams. Please try refreshing the page.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnedTeams();
  }, []);
  const handleOpenCreateModal = () => {
    setTeamToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (team) => {
    setTeamToEdit(team);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTeamToEdit(null);
  };

  const handleSuccess = () => {
    fetchOwnedTeams();
  };

  const tableData = useMemo(() => {
    const columns = [
      { Header: "Name", accessor: "name", align: "left", width: "30%" },
      { Header: "Members", accessor: "members", align: "left", width: "30%" },
      { Header: "Bots", accessor: "bots", align: "left", width: "30%" },
      { Header: "Actions", accessor: "actions", align: "right", sortAllowed: false, width: "10%" },
    ];

    const rows = teams.map((team) => ({
      name: team.name,
      members: team.members.map((m) => m.name).join(", "),
      bots: team.bots && team.bots.length > 0 ? team.bots.map((bot) => bot.name).join(", ") : "-",
      actions: (
        <>
          <Tooltip title="Edit Team">
            <SecureButton
              buttonKey="/button/edit-team"
              componentType="icon"
              color="default"
              size="small"
              onClick={() => handleOpenEditModal(team)}
            >
              <EditIcon />
            </SecureButton>
          </Tooltip>
        </>
      ),
    }));

    return { columns, rows };
  }, [teams]);

  const renderContent = () => {
    if (loading) {
      return (
        <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
          <CircularProgress />
        </MDBox>
      );
    }

    if (error) {
      return (
        <MDBox p={3}>
          <MDAlert color="error">{error}</MDAlert>
        </MDBox>
      );
    }

    return (
      <DataTable
        title="Manage Teams"
        table={tableData}
        isSorted={true}
        canSearch={true}
        showTotalEntries={false}
        entriesPerPage={{ defaultValue: 10 }}
        noEndBorder
        toolbarContent={
          <Tooltip title="Add New Team">
            <SecureButton
              buttonKey="/button/add-team"
              componentType="icon"
              color="default"
              size="small"
              onClick={() => handleOpenCreateModal()}
            >
              <AddIcon fontSize="medium" />
            </SecureButton>
          </Tooltip>
        }
      />
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={3} pb={3}>
        <Card>{renderContent()}</Card>
      </MDBox>

      <TeamModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        teamToEdit={teamToEdit}
        currentUserId={currentUserId}
      />
    </DashboardLayout>
  );
};

export default ManageTeams;
