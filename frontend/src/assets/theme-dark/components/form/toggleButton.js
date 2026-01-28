const toggleButton = {
  styleOverrides: {
    root: {
      "&.Mui-selected": {
        backgroundColor: "rgba(151, 192, 226, 0.15)",
        transform: "scale(1.05)",
        color: "#ffffffff",
        zIndex: 1,
        "&:hover": {
          backgroundColor: "rgba(66, 165, 245, 0.25)",
        },
      },
    },
  },
};

export default toggleButton;
