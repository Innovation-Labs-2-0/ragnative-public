import colors from "assets/theme-dark/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";
const { text } = colors;

const box = {
  "&.dynamic-card-created-at-box": {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    color: text.main,
  },
  "&.Knowledgebse-sort-menu-items": {
    display: "flex",
    alignItems: "center",
    color: text.main,
  },
  "&.table-headers": {
    fontSize: pxToRem(13),
    fontWeight: "bold",
    textTransform: "uppercase",
    overflow: "hidden",
    textOverflow: "ellipsis",
    position: "relative",
    color: text.main,
    whiteSpace: "nowrap",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
};

export default box;
