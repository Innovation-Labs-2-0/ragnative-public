import typography from "assets/theme/base/typography";

import colors from "assets/theme/base/colors";
const { size } = typography;
const { dark } = colors;

const breadcrumbs = {
  styleOverrides: {
    li: {
      lineHeight: 0,
      "& a, & span": {
        color: dark.main,
      },
    },

    separator: {
      fontSize: size.sm,
    },
  },
};

export default breadcrumbs;
