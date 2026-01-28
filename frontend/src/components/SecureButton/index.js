import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import MDButton from "components/style-components/MDButton";
import IconButton from "@mui/material/IconButton";

const SecureButton = ({
  buttonKey, //The unique identifier (like "/button/add-user") used to check if the current user has permission to view/use this button.
  componentType, //Determines what kind of button to render: like button or icon
  variant,
  color,
  size,
  onClick,
  startIcon, //Optional icon placed before the button text (for MDButton only).
  endIcon, //Optional icon placed after the button text (for MDButton only).
  disabled = false,
  children, //The child elements passed inside the button, usually text or icons.
  label, //Optional label for the button; used when no children are passed.
  ...rest //Any additional props (className, style, id, etc.) will be spread onto the component.
}) => {
  const { permissions, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated && permissions?.buttons?.length > 0) {
      setHasAccess(permissions.buttons.includes(buttonKey));
    } else {
      setHasAccess(false);
    }
  }, [permissions, isAuthenticated, loading, buttonKey]);

  if (loading || !isAuthenticated || !hasAccess) return null;

  if (componentType === "icon") {
    return (
      <IconButton color={color} onClick={onClick} disabled={disabled} {...rest}>
        {children}
      </IconButton>
    );
  }

  return (
    <MDButton
      variant={variant}
      color={color}
      size={size}
      onClick={onClick}
      startIcon={startIcon}
      endIcon={endIcon}
      disabled={disabled}
      {...rest}
    >
      {label || children}
    </MDButton>
  );
};

SecureButton.propTypes = {
  buttonKey: PropTypes.string.isRequired,
  componentType: PropTypes.oneOf(["button", "icon"]),
  label: PropTypes.string,
  variant: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default SecureButton;
