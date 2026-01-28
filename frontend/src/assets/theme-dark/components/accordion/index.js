import colors from "assets/theme-dark/base/colors";
import borders from "assets/theme-dark/base/borders";
import boxShadows from "assets/theme-dark/base/boxShadows";
import pxToRem from "assets/theme-dark/functions/pxToRem";

const { white, grey, background } = colors;
const { borderRadius } = borders;
const { md } = boxShadows;

const accordion = {
  styleOverrides: {
    root: {
      boxShadow: md,
      borderRadius: borderRadius.lg,
      backgroundColor: background.default,
      border: `${pxToRem(1)} solid ${grey[400]}`,
      "&:before": {
        display: "none",
      },
      "&.Mui-expanded": {
        margin: 0,
      },
    },
  },
};

export default accordion;
