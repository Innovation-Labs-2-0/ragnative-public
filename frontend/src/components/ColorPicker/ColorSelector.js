import React, { useState } from "react";
import { TextField, Button, Popover, InputAdornment, IconButton } from "@mui/material";
import { ChromePicker } from "react-color";
import PropTypes from "prop-types";
import MDButton from "components/style-components/MDButton";
import ColorizeIcon from "@mui/icons-material/Colorize";

function ColorSelector({ color, onChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenPicker = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePicker = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (newColor) => {
    onChange(newColor.hex);
  };

  return (
    <div>
      <TextField
        value={color}
        onChange={(e) => onChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  backgroundColor: color,
                  border: "1px solid #ccc",
                }}
              />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpenPicker}>
                <ColorizeIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePicker}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ChromePicker color={color} onChange={handleColorChange} disableAlpha />
      </Popover>
    </div>
  );
}

ColorSelector.propTypes = {
  color: PropTypes.string,
  onChange: PropTypes.any,
};

export default ColorSelector;
