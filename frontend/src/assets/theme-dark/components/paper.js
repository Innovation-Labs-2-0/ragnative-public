import colors from "assets/theme-dark/base/colors";

const { background, grey, info, white } = colors;

const paper = {
  styleOverrides: {
    root: {
      borderRadius: "12px",
      boxShadow: "none",
      border: "1px solid #6d6565",
      backgroundColor: background.default,

      // Style for Document Upload Component
      "&.upload-documents": {
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: grey[600],
        padding: 4,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: background.default,
        transition: "all 0.2s ease-in-out",
        color: white.main,
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        "&:hover": {
          backgroundColor: grey[800],
          borderColor: info.main,
        },
      },
    },
  },
};

export default paper;
