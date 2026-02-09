import colors from "assets/theme-dark/base/colors";

const { transparent, white } = colors;

const iconButton = {
  styleOverrides: {
    root: {
      color: white.main,
      "&:hover": {
        backgroundColor: transparent.main,
      },
    },
  },
};

export default iconButton;
