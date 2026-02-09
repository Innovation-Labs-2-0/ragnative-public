import colors from "assets/theme-dark/base/colors";

const { white } = colors;

const listItem = {
  defaultProps: {
    disableGutters: true,
  },

  styleOverrides: {
    root: {
      paddingTop: 0,
      paddingBottom: 0,
      color: white.main,
    },
  },
};

export default listItem;
