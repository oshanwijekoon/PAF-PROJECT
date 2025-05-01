import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Startup() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to SkillChef 🍳
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Learn and Share Cooking Skills with the Community
      </Typography>
      <Box display="flex" gap={2} justifyContent="center">
        <Button variant="contained" onClick={() => navigate("/login")}>
          Login
        </Button>
        <Button variant="outlined" onClick={() => navigate("/register")}>
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default Startup;
