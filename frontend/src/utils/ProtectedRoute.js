import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { getPermissionAgain } from "slices/authSlice";
import { checkUserDataFromStorage } from "./authUtil";
import storage from "./storage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const permissions = storage.getItem("permissions");

  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) return;
    const checkAuthStatus = async () => {
      checkUserDataFromStorage(dispatch);

      if (!permissions || !permissions.menu_items || permissions.menu_items.length === 0) {
        try {
          await dispatch(getPermissionAgain()).unwrap();
        } catch (error) {
          console.log("Fetching permissions failed:", error);
        }
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  const isRouteAllowed = (path) => {
    if (!permissions || !Array.isArray(permissions.menu_items)) {
      console.warn(
        "Permissions or menu_item not available or not an array in Redux state for path:",
        path
      );
      return false;
    }
    if (permissions.menu_items.includes(path)) {
      return true;
    }

    return permissions.menu_items.some((allowedPath) => {
      const pattern = "^" + allowedPath.replace(/:\w+/g, "[^/]+") + "$";
      return new RegExp(pattern).test(path);
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/authentication/sign-in" state={{ from: location }} replace />;
  }

  if (location.pathname === "/") {
    if (isRouteAllowed("/dashboard")) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  if (!isRouteAllowed(location.pathname)) {
    return <Navigate to="/page404" state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.any,
};
export default ProtectedRoute;
