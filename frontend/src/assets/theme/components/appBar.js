const sidebarWidth = "250px";
const appBar = {
  defaultProps: {
    color: "transparent",
  },

  styleOverrides: {
    root: ({ theme }) => {
      const { palette, functions } = theme;
      const { gradients } = palette;
      const { linearGradient } = functions;
      return {
        boxShadow: "none",
        "&.appbar-style": {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          borderRadius: 0,
          border: "none",
          BorderColor: "black",
          borderBottom: "1px solid rgba(255,255,255,0.3)",
          margin: 0,
          background: linearGradient(gradients.light.background, gradients.light.background),
          boxShadow: "none",
          paddingLeft: sidebarWidth,
          mb: 14,
        },
      };
    },
  },
};

export default appBar;
