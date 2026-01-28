import React, { useState } from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Collapse,
} from "@mui/material";
import { Edit, Delete, ExpandMore, CalendarToday, Memory } from "@mui/icons-material";
import PropTypes from "prop-types";
import { useDynamicCardContext } from "context/DynamicCardContext";

function DynamicCard({
  id,
  title,
  subheader,
  mainFields = { layout: "grid", fields: [] },
  defaultActions = {},
  customActions = [],
  expandableConfig = { enabled: false, layout: "grid", fields: [] },
  createdAt = { enabled: false, date: "" },
  headerIcon,
}) {
  const { activeCard, setActiveCard } = useDynamicCardContext();
  const expanded = activeCard === id;

  const handleToggle = () => {
    setActiveCard((prev) => (prev === id ? null : id));
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Card
        className="dynamic-card"
        sx={{
          transition: "all 0.3s ease",
          ...(expanded && {
            position: "absolute",
            zIndex: 20,
            width: "100%",
            boxShadow: 6,
            transform: "scale(1.02)",
          }),
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                flex: 1,
                minWidth: 0,
              }}
            >
              {headerIcon !== false && (
                <Box sx={{ flexShrink: 0, mt: 0.25 }}>
                  {React.isValidElement(headerIcon) ? (
                    headerIcon
                  ) : (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        bgcolor: "primary.50",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Memory sx={{ fontSize: 20, color: "primary.main" }} />
                    </Box>
                  )}
                </Box>
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body1" className="dynamic-card-typography-header">
                  {title}
                </Typography>
                {subheader && (
                  <Chip
                    label={subheader}
                    size="small"
                    className="dynamic-card-typography-subheader-chip"
                  />
                )}
              </Box>
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexShrink: 0,
              }}
            >
              {defaultActions.edit?.enabled && (
                <Tooltip title="Edit" key="edit">
                  <IconButton
                    size="small"
                    onClick={defaultActions.edit.onClick}
                    sx={{ margin: "4px" }}
                  >
                    <Edit fontSize="16px" />
                  </IconButton>
                </Tooltip>
              )}

              {defaultActions.delete?.enabled && (
                <Tooltip title="Delete" key="delete">
                  <IconButton
                    size="small"
                    onClick={defaultActions.delete.onClick}
                    sx={{ margin: "4px" }}
                  >
                    <Delete fontSize="16px" />
                  </IconButton>
                </Tooltip>
              )}

              {customActions.map((action, idx) => (
                <Tooltip title={action.label} key={idx}>
                  <IconButton
                    size="small"
                    color={action.color || "default"}
                    onClick={action.onClick}
                    sx={{ margin: "4px" }}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Main Fields */}
          {mainFields.fields.length > 0 && (
            <Box sx={{ mb: 2 }}>
              {mainFields.fields.map((field, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: mainFields.layout === "stacked" ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: mainFields.layout === "stacked" ? "flex-start" : "center",
                    gap: 1,
                    mb: index < mainFields.fields.length - 1 ? 1.25 : 0,
                  }}
                >
                  <Typography variant="body2" className="dynamic-card-typography-main-field-label">
                    {field.label}
                  </Typography>
                  <Box
                    sx={{
                      textAlign: mainFields.layout === "stacked" ? "left" : "right",
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="dynamic-card-typography-main-field-value"
                    >
                      {field.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Footer Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Created At Date */}
            {createdAt.enabled ? (
              <Box className="dynamic-card-created-at-box">
                <CalendarToday sx={{ fontSize: 14 }} />
                <Typography variant="caption" sx={{ fontSize: "12px" }}>
                  {createdAt.date}
                </Typography>
              </Box>
            ) : (
              <Box />
            )}

            {/* Expandable Toggle */}
            {expandableConfig.enabled && (
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{
                  width: 28,
                  height: 28,
                  transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease, background-color 0.2s",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ExpandMore sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {/* Expandable Content */}
          {expandableConfig.enabled && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
                {expandableConfig.fields.map((field, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: expandableConfig.layout === "stacked" ? "column" : "row",
                      justifyContent: "space-between",
                      alignItems: expandableConfig.layout === "stacked" ? "flex-start" : "center",
                      gap: 1,
                      mb: index < expandableConfig.fields.length - 1 ? 1.25 : 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      className="dynamic-card-typography-expandable-field-label"
                    >
                      {field.label}
                    </Typography>
                    <Box
                      sx={{
                        textAlign: expandableConfig.layout === "stacked" ? "left" : "right",
                        mt: expandableConfig.layout === "stacked" ? 0.5 : 0,
                      }}
                    >
                      <Typography
                        variant="body2"
                        className="dynamic-card-typography-expandable-field-value"
                      >
                        {field.value}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Collapse>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

DynamicCard.propTypes = {
  title: PropTypes.string.isRequired,
  subheader: PropTypes.string,
  mainFields: PropTypes.shape({
    layout: PropTypes.oneOf(["grid", "stacked"]),
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.node,
      })
    ),
  }),
  defaultActions: PropTypes.shape({
    edit: PropTypes.shape({
      enabled: PropTypes.bool,
      onClick: PropTypes.func,
    }),
    delete: PropTypes.shape({
      enabled: PropTypes.bool,
      onClick: PropTypes.func,
    }),
  }),
  customActions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      label: PropTypes.string,
      color: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  expandableConfig: PropTypes.shape({
    enabled: PropTypes.bool,
    layout: PropTypes.oneOf(["grid", "stacked"]),
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.node,
      })
    ),
  }),
  createdAt: PropTypes.shape({
    enabled: PropTypes.bool,
    date: PropTypes.string,
  }),
  headerIcon: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  id: PropTypes.string.isRequired,
};

export default DynamicCard;
