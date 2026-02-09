import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
  Paper,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";
import SecureButton from "components/SecureButton";

function DiscoverLinks({ links, onDelete }) {
  return (
    <>
      <InputLabel sx={{ fontSize: "14px", mt: 2, ml: 0.4 }}>Links To Include</InputLabel>
      <Paper sx={{ mt: 0.5, p: 2 }}>
        <List>
          {links.map((link, index) => (
            <ListItem
              key={index}
              sx={{
                mb: 1,
                borderRadius: 1,
                paddingRight: 6,
                position: "relative",
              }}
            >
              <ListItemText primary={link} primaryTypographyProps={{ fontSize: "14px" }} />
              <ListItemSecondaryAction>
                <SecureButton
                  buttonKey="/button/delete-discovered-link"
                  componentType="icon"
                  color="error"
                  onClick={() => onDelete(link)}
                >
                  <DeleteIcon fontSize="small" />
                </SecureButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
}

DiscoverLinks.propTypes = {
  links: PropTypes.arrayOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default DiscoverLinks;
