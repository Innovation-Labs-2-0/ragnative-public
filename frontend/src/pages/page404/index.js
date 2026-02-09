import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
      }}
    >
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={6} textAlign="center">
            <Typography variant="h1" component="h1" sx={{ fontSize: "5rem", fontWeight: "bold" }}>
              404
            </Typography>
            <Typography variant="h4" sx={{ mt: 2 }}>
              Oops! You&apos;re lost.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              The page you are looking for was not found.
            </Typography>
            <Button variant="contained" color="white" sx={{ mt: 3 }} onClick={goBack}>
              Go Back
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Page404;
