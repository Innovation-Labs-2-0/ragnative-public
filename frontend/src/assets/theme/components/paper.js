// assets/theme/components/paper.js

const paper = {
  styleOverrides: {
    root: {
      borderRadius: "12px",
      boxShadow: "none",
      border: "1px solid #e0e0e0",
      backgroundColor: "#ffffff",

      // Style for Document Upload Component
      "&.upload-documents": {
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        padding: 4,
        textAlign: "center",
        cursor: "pointer",
        backgroundColor: "#fafafa",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          backgroundColor: "#f0f0f0",
          borderColor: "#d0d0d0",
        },
        minHeight: "120px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      },
    },
  },
};

export default paper;
