// src/assets/theme/components/accordion/accordionSummary.js

import colors from "assets/theme-dark/base/colors";
import pxToRem from "assets/theme-dark/functions/pxToRem";
import borders from "assets/theme-dark/base/borders";

const { background, white } = colors;
const { borderRadius } = borders;

const accordionSummary = {
  styleOverrides: {
    root: {
      backgroundColor: background.card,
      minHeight: pxToRem(48),
      borderTopLeftRadius: borderRadius.lg,
      borderTopRightRadius: borderRadius.lg,
      color: white.main,
      "&.Mui-expanded": {
        minHeight: pxToRem(48),
      },
      "&:hover": {
        backgroundColor: background.default,
      },
    },

    content: {
      margin: 0,
      "&.Mui-expanded": {
        margin: 0,
      },
    },

    expandIconWrapper: {
      color: white.main,
    },
  },
};

export default accordionSummary;
