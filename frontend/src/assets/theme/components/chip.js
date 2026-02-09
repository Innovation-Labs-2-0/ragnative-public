import colors from "assets/theme/base/colors";

const { text, secondary, action } = colors;

const chip = {
  styleOverrides: {
    root: {
      "&.dynamic-card-typography-subheader-chip": {
        height: 20,
        fontSize: "11px",
        fontWeight: 500,
        bgcolor: action.hover,
        color: secondary.main,
        "& .MuiChip-label": {
          px: 1,
        },
      },
    },
  },
};

export default chip;
