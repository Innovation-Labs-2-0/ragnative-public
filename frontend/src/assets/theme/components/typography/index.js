import colors from "assets/theme/base/colors";

const { text, grey, primary, black, secondary } = colors;

const customTypography = {
  styleOverrides: {
    root: {
      "&.dynamic-card-typography-subheader": {
        height: 20,
        fontSize: "11px",
        fontWeight: 500,
        bgcolor: "action.hover",
        color: text.main,
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
        fontSize: "0.85rem",
        fontWeight: 600,
        color: primary.main,
      },

      "&.dynamic-card-typography-main-field-label": {
        fontSize: "13.5px",
        fontWeight: 500,
        color: black.light,
      },

      "&.dynamic-card-typography-expandable-field-value": {
        fontSize: "13px",
        color: grey[700],
        fontWeight: 500,
      },

      "&.dynamic-card-typography-expandable-field-label": {
        fontSize: "13px",
        color: black.light,
        fontWeight: 500,
      },

      "&.dynamic-card-typography-expandable-fields": {
        backgroundColor: grey[200],
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
        backgroundColor: grey[200],
        borderRadius: "4px",
        padding: "0.1rem 0.4rem",
      },
    },
  },
};

export default customTypography;
