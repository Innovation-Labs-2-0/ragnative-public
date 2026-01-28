import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

// Material Dashboard 2 React Helper Function
import rgba from "assets/theme/functions/rgba";

const { black, white, grey } = colors;
const { borderWidth, borderRadius } = borders;
const { md } = boxShadows;

const card = {
  styleOverrides: {
    root: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      minWidth: 0,
      wordWrap: "break-word",
      backgroundColor: white.main,
      backgroundClip: "border-box",
      border: `${borderWidth[0]} solid ${rgba(black.main, 0.125)}`,
      borderRadius: borderRadius.xl,
      boxShadow: md,
      overflow: "visible",
      "&.manage-bots-card": {
        margin: 2,
        minHeight: 440,
        backgroundColor: "#e9e9e9ff",
      },
    },

    "&.dynamic-card": {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "16px",
      border: "1px solid",
      borderColor: "divider",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      transition: "all 0.25s ease",

      "&:hover": {
        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        transform: "translateY(-2px)",
      },
    },
  },
};

export default card;
