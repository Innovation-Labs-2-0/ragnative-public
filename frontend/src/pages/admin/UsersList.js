import { useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
  Card,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Custom Components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import MDAlert from "components/style-components/MDAlert";
import DataTable from "components/Tables/DataTable";
import MDButton from "components/style-components/MDButton";
import { getRequest, deleteRequest } from "../../utils/apiClient";
import UserModal from "components/Modals/UserModal"; // You should create this modal for add/edit user
import SecureButton from "components/SecureButton";
import { ROLE_LABELS } from "utils/constants";

function ActiveCell({ value }) {
  return value ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />;
}
ActiveCell.propTypes = {
  value: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]).isRequired,
};

function ActionsCell({ row, onEdit, onDelete }) {
  const { id } = row.original;
  return (
    <>
      <SecureButton
        buttonKey="/button/edit-user"
        componentType="icon"
        color="default"
        onClick={() => onEdit(row.original)}
      >
        <Tooltip title="Edit User">
          <EditIcon fontSize="small" sx={{ color: "grey.600" }} />
        </Tooltip>
      </SecureButton>

      <SecureButton
        buttonKey="/button/delete-user"
        componentType="icon"
        color="error"
        onClick={() => onDelete(id)}
      >
        <Tooltip title="Delete User">
          <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />
        </Tooltip>
      </SecureButton>
    </>
  );
}
ActionsCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

function TeamCell({ teams }) {
  if (!Array.isArray(teams) || teams.length === 0) return "N/A";
  const display = teams.slice(0, 2).join(", ");
  const hidden = teams.length > 2 ? `, +${teams.length - 2} more` : "";
  return (
    <Tooltip title={teams.join(", ")}>
      <span>
        {display}
        {hidden}
      </span>
    </Tooltip>
  );
}
TeamCell.propTypes = {
  teams: PropTypes.arrayOf(PropTypes.string),
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getRequest("/users/get-users");
      setUsers(Array.isArray(response) ? response : []);
    } catch (err) {
      setError("Could not fetch users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreateModal = () => {
    setUserToEdit(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    console.log(user);
    setUserToEdit(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setUserToEdit(null);
  };

  const handleSuccess = () => {
    fetchUsers();
  };

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
    setTimeout(() => setAlert({ open: false, type: "", message: "" }), 5000);
  };

  const showConfirmDialog = (title, message, onConfirm) => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleDeleteUser = async (id) => {
    showConfirmDialog(
      "Delete User",
      "Are you sure you want to delete this user? This action cannot be undone.",
      async () => {
        try {
          await deleteRequest(`/users/${id}`);
          showAlert("success", "User deleted successfully");
          fetchUsers();
        } catch (err) {
          console.error("Delete failed", err);
          showAlert("error", "Could not delete user. Please try again.");
        }
        setConfirmDialog({ open: false, title: "", message: "", onConfirm: null });
      }
    );
  };

  const tableData = useMemo(() => {
    const columns = [
      { Header: "Name", accessor: "name", align: "left", width: "20%" },
      { Header: "Email", accessor: "email", align: "left", width: "20%" },
      {
        Header: "Role",
        accessor: "role",
        align: "left",
        width: "10%",
        Cell: ({ value }) => ROLE_LABELS[value] || value,
      },
      {
        Header: "Teams",
        accessor: "teams",
        align: "left",
        width: "20%",
        Cell: ({ value }) => <TeamCell teams={value} />,
      },
      {
        Header: "Active",
        accessor: "active",
        align: "center",
        width: "10%",
        Cell: ({ value }) => <ActiveCell value={value} />,
      },
      {
        Header: "Actions",
        accessor: "actions",
        align: "right",
        sortAllowed: false,
        width: "12.5%",
        Cell: ({ row }) => (
          <ActionsCell row={row} onEdit={handleOpenEditModal} onDelete={handleDeleteUser} />
        ),
      },
    ];

    const rows = users.map((user) => ({
      ...user,
      id: user.id, // Ensure every user has an 'id' field for modal/edit
      teams: Array.isArray(user.teams) ? user.teams : user.team ? [user.team] : [],
    }));

    return { columns, rows };
  }, [users]);

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
        title="Manage Users"
        table={tableData}
        isSorted={true}
        canSearch={true}
        showTotalEntries={false}
        entriesPerPage={{ defaultValue: 10 }}
        noEndBorder
        toolbarContent={
          <Tooltip title="Add New User">
            <SecureButton
              buttonKey="/button/add-user"
              componentType="icon"
              color="primary"
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
      {alert.open && (
        <MDBox pt={2} px={3}>
          <MDAlert
            color={alert.type}
            dismissible
            onClose={() => setAlert({ open: false, type: "", message: "" })}
          >
            {alert.message}
          </MDAlert>
        </MDBox>
      )}
      <MDBox pt={3} pb={3}>
        <Card>{renderContent()}</Card>
      </MDBox>

      <UserModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        userToEdit={userToEdit}
      />
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: "", message: "", onConfirm: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <MDTypography variant="h6" fontWeight="medium">
            {confirmDialog.title}
          </MDTypography>
        </DialogTitle>
        <DialogContent>
          <MDTypography variant="body2" color="text">
            {confirmDialog.message}
          </MDTypography>
        </DialogContent>
        <DialogActions>
          <MDButton
            variant="outlined"
            color="secondary"
            onClick={() =>
              setConfirmDialog({ open: false, title: "", message: "", onConfirm: null })
            }
          >
            Cancel
          </MDButton>
          <MDButton variant="contained" color="error" onClick={confirmDialog.onConfirm}>
            Delete
          </MDButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};
UsersList.propTypes = {
  value: PropTypes.any,
  row: PropTypes.any,
};
export default UsersList;
