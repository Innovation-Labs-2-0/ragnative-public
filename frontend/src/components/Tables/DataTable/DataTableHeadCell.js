import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import MDBox from "components/style-components/MDBox";
import { useMaterialUIController } from "context";
import { useRef, useState, useEffect } from "react";
import { Box } from "@mui/material";
function DataTableHeadCell({ width, children, sorted, sortAllowed, align, ...rest }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const parentRef = useRef(null);

  return (
    <MDBox
      component="th"
      width={width}
      py={1.2}
      px={3}
      sx={({ palette: { light }, borders: { borderWidth } }) => ({
        borderBottom: `${borderWidth[1]} solid ${light.main}`,
        backgroundColor: `${light.main}`,
      })}
      color={`${darkMode ? "text" : "white"}`}
      ref={parentRef}
    >
      <Box className="table-headers">
        {children}
        {sortAllowed && sorted !== "none" && (
          <MDBox display="flex" flexDirection="column" ml={0.5}>
            <Icon
              sx={({ typography: { size } }) => ({
                fontSize: size.lg,
                height: "10px",
                lineHeight: "10px",
                color: sorted === "asce" ? "text" : "secondary",
                opacity: sorted === "asce" ? 1 : 0.5,
              })}
            >
              arrow_drop_up
            </Icon>
            <Icon
              sx={({ typography: { size } }) => ({
                fontSize: size.lg,
                height: "10px",
                lineHeight: "10px",
                mt: -0.5,
                color: sorted === "desc" ? "text" : "secondary",
                opacity: sorted === "desc" ? 1 : 0.5,
              })}
            >
              arrow_drop_down
            </Icon>
          </MDBox>
        )}
      </Box>
    </MDBox>
  );
}

// Setting default values for the props of DataTableHeadCell
DataTableHeadCell.defaultProps = {
  width: "auto",
  sorted: "none",
  align: "left",
  sortAllowed: true,
};

// Typechecking props for the DataTableHeadCell
DataTableHeadCell.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node.isRequired,
  sorted: PropTypes.oneOf([false, "none", "asce", "desc"]),
  align: PropTypes.oneOf(["left", "right", "center"]),
  sortAllowed: PropTypes.bool,
};

export default DataTableHeadCell;
