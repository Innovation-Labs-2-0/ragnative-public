import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";
// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/style-components/MDBox";
import MDTypography from "components/style-components/MDTypography";

// Material Dashboard 2 React example components
import SidenavCollapse from "components/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "components/Sidenav/SidenavRoot";
import sidenavLogoLabel from "components/Sidenav/styles/sidenav";
import MDAlert from "components/style-components/MDAlert";
// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import { handleLogout } from "utils/sessionUtil";

function Sidenav({ color, brand, brandName, routes, user, ...rest }) {
  const { permissions } = useSelector((state) => state.auth);
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const [authorizedRoutes, setAuthorizedRoutes] = useState([]);
  const [openCollapse, setOpenCollapse] = useState(null);
  const reduxDispatch = useDispatch();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ open: false, type: "", message: "" });

  let textColor = "white";

  if (transparentSidenav || (whiteSidenav && !darkMode)) {
    textColor = "dark";
  } else if (whiteSidenav && darkMode) {
    textColor = "inherit";
  }

  const closeSidenav = () => setMiniSidenav(dispatch, true);
  const handleCollapseClick = (key) => {
    setOpenCollapse(openCollapse === key ? null : key);
  };
  useEffect(() => {
    // A function that sets the mini state of the sidenav.
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    }

    /**
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
    window.addEventListener("resize", handleMiniSidenav);

    // Call the handleMiniSidenav function to set the state with the initial value.
    handleMiniSidenav();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const isSidenavRouteAllowed = (currentRoutePath) => {
    if (!permissions || !Array.isArray(permissions.menu_items)) {
      return false;
    }

    return permissions.menu_items.some((allowedPattern) => {
      if (allowedPattern === currentRoutePath) {
        return true;
      }
      const regexPattern = allowedPattern
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/:[a-zA-Z0-9_]+/g, "[^/]+");

      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(currentRoutePath);
    });
  };

  useEffect(() => {
    // Recursively filter routes and their children
    const filterRoutes = (routesArr) => {
      return routesArr
        .map((route) => {
          // If route has children (collapse)
          if (route.collapse && Array.isArray(route.collapse)) {
            const filteredCollapse = filterRoutes(route.collapse);
            // Only show parent if at least one child is allowed
            if (filteredCollapse.length === 0) return null;
            return { ...route, collapse: filteredCollapse };
          }
          // For top-level routes
          if (!route.route) return route; // Keep titles/dividers
          return isSidenavRouteAllowed(route.route) ? route : null;
        })
        .filter(Boolean);
    };

    setAuthorizedRoutes(filterRoutes(routes));
  }, [routes, permissions]);

  const showAlert = (type, message) => {
    setAlert({ open: true, type, message });
    setTimeout(() => setAlert({ open: false, type: "", message: "" }), 5000);
  };

  const logoutUser = async () => {
    await handleLogout(reduxDispatch, navigate, null, (error) =>
      showAlert("error", "Logout failed. Please try again.")
    );
  };

  const renderRoutes = authorizedRoutes.map(
    ({ type, name, icon, title, noCollapse, key, href, route, collapse }) => {
      let returnValue;
      if (type === "collapse" && collapse) {
        // Render submenu
        return (
          <div key={key}>
            <div onClick={() => handleCollapseClick(key)} style={{ cursor: "pointer" }}>
              <SidenavCollapse name={name} icon={icon} />
            </div>
            {openCollapse === key && (
              <List sx={{ pl: 2 }}>
                {collapse.map((sub) => (
                  <NavLink key={sub.key} to={sub.route}>
                    <SidenavCollapse name={sub.name} icon={sub.icon} />
                  </NavLink>
                ))}
              </List>
            )}
          </div>
        );
      } else if (type === "collapse") {
        returnValue = href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
          >
            <SidenavCollapse
              name={name}
              icon={icon}
              active={key === collapseName}
              noCollapse={noCollapse}
            />
          </Link>
        ) : (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
          </NavLink>
        );
      } else if (type === "title") {
        returnValue = (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {title}
          </MDTypography>
        );
      } else if (type === "divider") {
        returnValue = (
          <Divider
            key={key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      } else if (type === "logout") {
        returnValue = (
          <NavLink key={key} to={route}>
            <SidenavCollapse name={name} icon={icon} />
          </NavLink>
        );
      }

      return returnValue;
    }
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
      <SidenavRoot
        {...rest}
        variant="permanent"
        ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
      >
        <MDBox pt={3} pb={1} px={4} textAlign="center">
          <MDBox
            display={{ xs: "block", xl: "none" }}
            position="absolute"
            top={0}
            right={0}
            p={1.625}
            onClick={closeSidenav}
            sx={{ cursor: "pointer" }}
          >
            <MDTypography variant="h6" color="secondary">
              <Icon sx={{ fontWeight: "bold" }}>close</Icon>
            </MDTypography>
          </MDBox>
          <MDBox component={NavLink} to="/" display="flex" alignItems="center">
            {brand && <MDBox component="img" src={brand} alt="Brand" width="10rem" />}
          </MDBox>
        </MDBox>
        <Divider
          light={
            (!darkMode && !whiteSidenav && !transparentSidenav) ||
            (darkMode && !transparentSidenav && whiteSidenav)
          }
          sx={{ mt: 0.1, mb: 3 }}
        />
        <List>{renderRoutes}</List>

        <MDBox mt="auto" mb={1} px={2}>
          <Divider
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
          <div onClick={logoutUser} style={{ cursor: "pointer" }}>
            <SidenavCollapse name="Logout" icon={<Icon fontSize="small">logout</Icon>} />
          </div>
        </MDBox>
      </SidenavRoot>
    </>
  );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
  color: "info",
  brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({
    role: PropTypes.string, // add other user fields if needed
  }),
};

export default Sidenav;
