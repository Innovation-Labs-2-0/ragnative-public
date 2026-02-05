import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// react-router components
import { useLocation, Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import { Tooltip } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/style-components/MDBox";
import MDInput from "components/style-components/MDInput";
import MDAlert from "components/style-components/MDAlert";

// Material Dashboard 2 React example components
import Breadcrumbs from "components/Breadcrumbs";
// Custom styles for DashboardNavbar
import { navbar, navbarContainer, navbarRow, navbarMobileMenu } from "./styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setDarkMode,
  setTransparentNavbar,
  setMiniSidenav,
} from "context";

import { handleLogout } from "utils/sessionUtil";

function DashboardNavbar({ absolute, light, isMini, routes }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  const [profileMenu, setProfileMenu] = useState(null);
  const openProfileMenu = (event) => setProfileMenu(event.currentTarget);
  const closeProfileMenu = () => setProfileMenu(null);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
    setTimeout(() => setAlert({ open: false, type: "", message: "" }), 5000);
  };

  const logoutUser = async () => {
    await handleLogout(
      reduxDispatch,
      navigate,
      () => closeProfileMenu(),
      (error) => showAlert("error", "Logout failed. Please try again.")
    );
  };

  let headerIsLink = false;
  if (routes == null) {
    routes = useLocation().pathname.split("/").slice(1);
    headerIsLink = true;
  }
  useEffect(() => {
    // Setting the navbar type
    setNavbarType("sticky");

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setDarkMode(dispatch, !darkMode);

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, secondary, black, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? dark.main : black.light; //secondary to sidebar

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(white.main, 0.6) : dark.main;
      }

      return colorValue;
    },
  });

  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenu}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(profileMenu)}
      onClose={closeProfileMenu}
    >
      <MenuItem component={Link} to="/profile" onClick={closeProfileMenu}>
        <Icon sx={{ paddingRight: "1.5rem" }}>person</Icon> My Profile
      </MenuItem>
      <MenuItem onClick={logoutUser}>
        <Icon sx={{ paddingRight: "1.5rem" }}>logout</Icon> Logout
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {alert.open && (
        <MDBox
          sx={{
            position: "fixed",
            top: 10,
            right: 10,
            zIndex: 9999,
            minWidth: 300,
          }}
        >
          <MDAlert
            color={alert.type}
            dismissible
            onClose={() => setAlert({ open: false, type: "", message: "" })}
          >
            {alert.message}
          </MDAlert>
        </MDBox>
      )}
      <AppBar className="appbar-style" sx={(theme) => navbar(theme, { absolute, light, darkMode })}>
        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <MDBox mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs
              icon="home"
              title={routes[routes.length - 1]}
              route={routes}
              light={light}
              clickable={headerIsLink}
            />
          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox color="white">
                <IconButton color="inherit" onClick={openProfileMenu} size="large" disableRipple>
                  <Tooltip title="User Profile">
                    <Icon sx={iconsStyle}>account_circle</Icon>
                  </Tooltip>
                </IconButton>
                {renderProfileMenu()}
                <IconButton
                  size="small"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Tooltip title={miniSidenav ? "Close Sidebar" : "Open Sidebar"}>
                    <Icon sx={iconsStyle} fontSize="medium">
                      {miniSidenav ? "menu_open" : "menu"}
                    </Icon>
                  </Tooltip>
                </IconButton>
                <IconButton
                  size="large"
                  disableRipple
                  color="inherit"
                  onClick={handleConfiguratorOpen}
                >
                  <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    <Icon sx={iconsStyle}>{darkMode ? "light_mode" : "dark_mode"}</Icon>
                  </Tooltip>
                </IconButton>
              </MDBox>
            </MDBox>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
  routes: null,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
  routes: PropTypes.array,
};

export default DashboardNavbar;
