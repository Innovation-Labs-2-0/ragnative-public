import React from "react";
import { useSelector } from "react-redux";
import { Modal, Card, Typography } from "@mui/material";
import MDBox from "components/style-components/MDBox";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 500,
  p: 3,
  borderRadius: 2,
};

const LicenseModal = () => {
  const licenseError = useSelector((state) => state.license.error);

  return (
    <Modal open={!!licenseError} disableEscapeKeyDown>
      <Card sx={modalStyle}>
        <MDBox sx={{ textAlign: "center" }}>
          <Typography variant="h5" fontWeight="600" mt={2} mb={1}>
            🚫 License Validation Failed
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            {licenseError?.message}
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ display: "block", mb: 3 }}>
            Please contact your administrator.
          </Typography>
        </MDBox>
      </Card>
    </Modal>
  );
};

export default LicenseModal;
