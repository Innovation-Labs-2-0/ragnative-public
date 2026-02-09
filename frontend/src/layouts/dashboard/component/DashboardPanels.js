import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import DefaultInfoCard from "components/Cards/InfoCards/DefaultInfoCard";
import MDTypography from "components/style-components/MDTypography";
import Divider from "@mui/material/Divider";

export default function DashboardPanel({ title, viewText, viewPath, items }) {
  return (
    <Card sx={{ borderRadius: 3, overflowY: "auto", height: 520 }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MDTypography color="text" variant="h5" p={1} fontWeight="medium">
          {title}
          <Divider />
        </MDTypography>
        {items.map((item, index) => (
          <DefaultInfoCard
            key={index}
            color={item.color || "info"}
            icon={
              item.avatar ? (
                <img
                  src={item.avatar}
                  alt="avatar"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                item.icon
              )
            }
            title={item.title}
            description={item.description}
            value={item.value}
          />
        ))}
        <Link
          to={viewPath}
          style={{
            marginTop: "auto",
            textAlign: "right",
            textDecoration: "none",
            fontSize: "medium",
            fontWeight: 500,
            color: "#1976d2",
            cursor: "pointer",
          }}
        >
          {viewText}
        </Link>
      </CardContent>
    </Card>
  );
}

DashboardPanel.propTypes = {
  title: PropTypes.string.isRequired,
  viewText: PropTypes.string,
  viewPath: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string,
      icon: PropTypes.node,
      avatar: PropTypes.string,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
};
