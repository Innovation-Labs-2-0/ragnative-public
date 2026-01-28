import PropTypes from "prop-types";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";
import { Icon } from "@mui/material";

function DefaultInfoCard({ color, icon, title, description, value }) {
  return (
    <Card
      sx={{
        mb: 2,
      }}
    >
      <MDBox mx={2.5} display="flex" alignItems="flex-start" gap={1}>
        <MDBox
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgColor={color}
          color="white"
          minWidth="2.3rem"
          minHeight="2.3rem"
          shadow="md"
          borderRadius="lg"
          mt={1}
          variant="gradient"
        >
          <Icon>{icon}</Icon>
        </MDBox>
        <MDBox
          pb={2}
          px={2}
          textAlign="left"
          display="flex"
          flexDirection="column"
          lineHeight={1.25}
        >
          <MDTypography
            variant="h6"
            fontWeight="medium"
            textTransform="capitalize"
            mt={0.5}
            sx={{ fontSize: "15px" }}
          >
            {title}
          </MDTypography>
          {description && (
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          )}
          {description && !value ? null : <Divider />}
          {value && (
            <MDTypography variant="h5" fontWeight="medium">
              {value}
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of DefaultInfoCard
DefaultInfoCard.defaultProps = {
  color: "info",
  value: "",
  description: "",
};

// Typechecking props for the DefaultInfoCard
DefaultInfoCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default DefaultInfoCard;
