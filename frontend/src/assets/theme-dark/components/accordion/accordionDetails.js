import colors from "assets/theme-dark/base/colors";
import borders from "assets/theme-dark/base/borders";
import pxToRem from "assets/theme-dark/functions/pxToRem";

const { grey, background } = colors;
const { borderRadius } = borders;

const accordionDetails = {
  styleOverrides: {
    root: {
      backgroundColor: background.default,
      padding: `${pxToRem(16)} ${pxToRem(24)}`,
      borderTop: `1px solid ${grey[300]}`,
      borderBottomLeftRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
    },
  },
};

export default accordionDetails;
