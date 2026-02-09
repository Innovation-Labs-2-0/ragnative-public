import colors from "assets/theme-dark/base/colors";

const { text, grey, primary, secondary } = colors;

const customTypography = {
  styleOverrides: {
    root: {
      "&.dynamic-card-typography-subheader": {
        height: 20,
        fontSize: "11px",
        fontWeight: 500,
        bgcolor: "action.hover",
        color: text.secondary,
        "& .MuiChip-label": {
          px: 1,
        },
      },

      "&.dynamic-card-typography-header": {
        fontSize: "16px",
        fontWeight: 500,
        color: text.main,
        mb: 0.5,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },

      "&.dynamic-card-typography-main-field-value": {
        borderRadius: 1.5,
        px: 1,
        py: 0.3,
        fontSize: "0.85rem",
        fontWeight: 500,
        color: primary.main,
      },

      "&.dynamic-card-typography-main-field-label": {
        fontSize: "14px",
        color: secondary.main,
        flexShrink: 0,
      },

      "&.dynamic-card-typography-expandable-field-label": {
        fontSize: "13px",
        color: text.main,
        fontWeight: 500,
      },

      "&.dynamic-card-typography-expandable-field-value": {
        fontSize: "13px",
        color: text.main,
        fontWeight: 500,
      },

      "&.dynamic-card-typography-expandable-fields": {
        backgroundColor: grey[800],
        color: text.main,
        padding: "0.5rem",
        borderRadius: "0.2rem",
        marginTop: "0.5rem",
      },

      "&.dynamic-card-typography-calendar": {
        color: text.main,
        fontSize: "0.8rem",
      },
      "&.chart-badge": {
        fontSize: "0.8rem",
        backgroundColor: grey[600],
        borderRadius: "4px",
        padding: "0.1rem 0.4rem",
      },
    },
  },
};

export default customTypography;
