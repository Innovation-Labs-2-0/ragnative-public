import colors from "assets/theme-dark/base/colors";

const { transparent, white } = colors;

const textField = {
  styleOverrides: {
    root: {
      backgroundColor: transparent.main,
      color: white.main,
      "& .MuiInputLabel-root.Mui-disabled": {
        color: white.main,
      },

      "& .MuiInputBase-input.Mui-disabled": {
        WebkitTextFillColor: white.main,
        opacity: 0.6,
      },

      "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: white.main,
      },
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
      color: white.main,
    },
  },
};

export default textField;
