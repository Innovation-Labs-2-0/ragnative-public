import colors from "assets/theme-dark/base/colors";

const { transparent, white } = colors;

const textField = {
  styleOverrides: {
    root: {
      backgroundColor: transparent.main,
      color: white.main,
    },

    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: white.main,
    },
  },
};

export default textField;
