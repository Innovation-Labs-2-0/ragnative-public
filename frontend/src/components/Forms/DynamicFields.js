import React, { useState } from "react";
import { Grid } from "@mui/material";
import MDInput from "../style-components/MDInput";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PropTypes from "prop-types";
import { InputAdornment, IconButton, Tooltip } from "@mui/material";

/**
 * @component DynamicFields
 * @description A dynamic form component that renders a set of input fields based on a configuration schema.
 * It is designed to be controlled by a parent component, receiving the form's structure, current data,
 * and a function to update that data. Each field is rendered within a Material-UI Grid item.
 *
 * @param {object} props The component props.
 * @param {object} props.configSchema - An object defining the structure and properties of the form fields.
 *   The keys of this object represent the `name` of each input, and the values are objects
 *   that specify the input's properties.
 *   Example structure for a single field:
 *   {
 *     label: "Field Label",       // {string} The text to display as the input's label.
 *     description: "Placeholder", // {string} The placeholder text for the input.
 *     type: "text",               // {string} [Optional] The input type (e.g., 'text', 'number', 'password'). Defaults to 'input'.
 *     display_size: 6             // {number} [Optional] The Material-UI grid size (xs). Defaults to 12.
 *   }
 *
 * @param {Function} props.onChange - The handler function from the parent
 *   component. It is called on every input change to update the form's state.
 *
 * @param {object} props.formData - The object that holds the current state of the form data.
 *   It must contain a `config` key, which is an object where keys match the keys in `configSchema`
 *   and values are the current input values.
 *   Example: { config: { fieldName1: 'value1', fieldName2: 'value2' } }
 *
 * @returns {React.ReactElement} A React Fragment containing a series of Material-UI `<Grid>` items,
 *   each wrapping a styled `<MDInput>` component configured according to the `configSchema`.
 *
 * @example
 * // In a parent component
 *
 * const formSchema = {
 *   host: {
 *     label: "Database Host",
 *     description: "Enter the hostname or IP address",
 *     type: "text",
 *     display_size: 6
 *   },
 *   port: {
 *     label: "Port Number",
 *     description: "Enter the port number",
 *     type: "number",
 *     display_size: 6
 *   }
 * };
 *
 * return (
 *   <Grid container spacing={2}>
 *     <DynamicFields
 *       configSchema={formSchema}
 *       formData={formData}
 *       setFormData={handleFormDataChange}
 *     />
 *   </Grid>
 * );
 */
function DynamicFields({ configSchema, formData, onChange }) {
  const [showPasswords, setShowPasswords] = useState({});
  const handleTogglePasswordVisibility = (name) => {
    setShowPasswords((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      {Object.entries(configSchema).map(([name, schema]) => {
        const isPasswordField = schema.type === "password";
        const inputType = isPasswordField
          ? showPasswords[name]
            ? "text"
            : "password"
          : schema.type || "text";

        // Conditionally create the InputProps for the adornment
        const inputProps = isPasswordField
          ? {
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title={showPasswords[name] ? "Hide" : "Show"}>
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => handleTogglePasswordVisibility(name)}
                      edge="end"
                      color="secondary"
                    >
                      {showPasswords[name] ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }
          : {};

        return (
          <Grid item xs={schema.display_size || 12} key={name}>
            <MDInput
              fullWidth
              label={schema.label}
              variant="outlined"
              onChange={onChange}
              value={formData[name] || ""}
              name={name}
              placeholder={schema.description}
              type={inputType}
              InputProps={inputProps}
              required={schema.required}
            />
          </Grid>
        );
      })}
    </>
  );
}

DynamicFields.propTypes = {
  configSchema: PropTypes.object,
  onChange: PropTypes.func,
  formData: PropTypes.object,
};

export default DynamicFields;
