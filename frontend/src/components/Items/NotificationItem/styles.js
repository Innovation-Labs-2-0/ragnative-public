function menuItem(theme) {
  const { palette, borders, transitions } = theme;

  const { secondary, light, info } = palette;
  const { borderRadius } = borders;

  return {
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
    color: secondary.main,
    borderRadius: borderRadius.md,
    transition: transitions.create("background-color", {
      easing: transitions.easing.easeInOut,
      duration: transitions.duration.standard,
    }),

    "& *": {
      transition: "color 100ms linear",
    },

    "&:not(:last-child)": {
      mb: 1,
    },

    "&:hover": {
      backgroundColor: light.main,

      "& *": {
        color: info.main,
      },
    },
  };
}

export default menuItem;
