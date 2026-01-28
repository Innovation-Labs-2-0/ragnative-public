/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Fade from "@mui/material/Fade";

// Material Dashboard 2 React base styles
import colors from "assets/theme-dark/base/colors";
import typography from "assets/theme-dark/base/typography";
import borders from "assets/theme-dark/base/borders";

// Material Dashboard 2 React helper functions
import pxToRem from "assets/theme-dark/functions/pxToRem";

const { black, white, gradients } = colors;
const { size, fontWeightRegular } = typography;
const { borderRadius } = borders;

const tooltip = {
  defaultProps: {
    arrow: true,
    TransitionComponent: Fade,
  },

  styleOverrides: {
    tooltip: {
      maxWidth: pxToRem(300),
      backgroundColor: gradients.secondary.main,
      color: white.main,
      fontSize: size.sx,
      fontWeight: fontWeightRegular,
      textAlign: "center",
      borderRadius: borderRadius.md,
      opacity: 0.8,
      padding: `${pxToRem(5)} ${pxToRem(8)} ${pxToRem(4)}`,
    },

    arrow: {
      color: gradients.secondary.main,
    },
  },
};

export default tooltip;
