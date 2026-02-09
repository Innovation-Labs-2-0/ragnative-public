import colors from "assets/theme-dark/base/colors";
import typography from "assets/theme-dark/base/typography";

const { light } = colors;
const { size } = typography;

const breadcrumbs = {
  styleOverrides: {
    li: {
      lineHeight: 0,
    },

    separator: {
      fontSize: size.sm,
      color: light.main,
    },
  },
};

export default breadcrumbs;
