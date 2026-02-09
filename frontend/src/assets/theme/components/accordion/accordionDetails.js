// src/assets/theme/components/accordion/accordionDetails.js

import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import pxToRem from "assets/theme/functions/pxToRem";

const { grey } = colors;
const { borderRadius } = borders;

const accordionDetails = {
  styleOverrides: {
    root: {
      backgroundColor: "#ffffff",
      padding: `${pxToRem(16)} ${pxToRem(24)}`,
      borderTop: `1px solid ${grey[300]}`,
      borderBottomLeftRadius: borderRadius.lg,
      borderBottomRightRadius: borderRadius.lg,
    },
  },
};

export default accordionDetails;
