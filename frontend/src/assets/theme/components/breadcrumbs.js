import typography from "assets/theme/base/typography";

const { size } = typography;

const breadcrumbs = {
  styleOverrides: {
    li: {
      lineHeight: 0,
    },

    separator: {
      fontSize: size.sm,
    },
  },
};

export default breadcrumbs;
