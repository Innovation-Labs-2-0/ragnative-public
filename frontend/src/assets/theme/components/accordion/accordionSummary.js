// src/assets/theme/components/accordion/accordionSummary.js

import colors from "assets/theme/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";
import borders from "assets/theme/base/borders";
import rgba from "assets/theme/functions/rgba";

const { info, grey, background } = colors;
const { borderRadius } = borders;

const accordionSummary = {
  styleOverrides: {
    root: {
      backgroundColor: background.default,
      minHeight: pxToRem(48),
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      "&.Mui-expanded": {
        minHeight: pxToRem(48),
      },
      "&:hover": {
        backgroundColor: "#f5f5f5",
      },
    },

    content: {
      margin: 0,
      "&.Mui-expanded": {
        margin: 0,
      },
    },

    expandIconWrapper: {
      //   color: info.main, // Change the expand icon color
    },
  },
};

export default accordionSummary;
