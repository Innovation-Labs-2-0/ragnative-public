/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/style-components/MDBox";
import { useRef, useState, useEffect } from "react";
import MDTypography from "components/style-components/MDTypography";
import { useMaterialUIController } from "context";

function DataTableBodyCell({ noBorder, align, children }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const parentRef = useRef(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) {
        // Calculate the effective content width by subtracting padding
        // px={3} on MDBox means 3 * 8px = 24px left and 24px right padding
        const effectiveContentWidth = parentRef.current.offsetWidth - 2 * 24; // Assuming default theme spacing unit is 8px for MDBox px prop
        setParentWidth(effectiveContentWidth > 0 ? effectiveContentWidth : 0);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  return (
    <MDBox
      component="td"
      textAlign={align}
      py={0.8}
      px={3}
      sx={({ palette: { light }, typography: { size }, borders: { borderWidth } }) => ({
        fontSize: size.sm,
        borderBottom: noBorder ? "none" : `${borderWidth[1]} solid ${light.main}`,
        overflow: "hidden",
      })}
      ref={parentRef}
    >
      <MDBox width={parentWidth} display="block" color="text">
        <MDTypography
          variant="subtitle1"
          sx={({ typography: { size } }) => ({
            color: `${darkMode ? "white" : "#495057"}`,
            fontSize: size.sm,
            verticalAlign: "middle",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          })}
        >
          {children}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of DataTableBodyCell
DataTableBodyCell.defaultProps = {
  noBorder: false,
  align: "left",
};

// Typechecking props for the DataTableBodyCell
DataTableBodyCell.propTypes = {
  children: PropTypes.node.isRequired,
  noBorder: PropTypes.bool,
  align: PropTypes.oneOf(["left", "right", "center"]),
};

export default DataTableBodyCell;
