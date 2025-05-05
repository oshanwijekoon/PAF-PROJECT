import React from "react";
import { Box, Button, Typography, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Startup() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 10, textAlign: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)",
          mb: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            👨‍🍳 SkillChef
          </Typography>
        </Box>
        <Typography
          variant="h6"
          sx={{ color: "white", opacity: 0.9, mb: 2 }}
        >
          Learn and Share Cooking Skills with the Community
        </Typography>
      </Paper>
      <Box display="flex" gap={2} justifyContent="center">
        <Button
          variant="contained"
          onClick={() => navigate("/login")}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            background:
              "linear-gradient(45deg, #FF6B6B, #FF9F43)",
            boxShadow: "0 4px 15px rgba(255,107,107,0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 20px rgba(255,107,107,0.4)",
            },
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate("/register")}
          sx={{
            py: 1.5,
            px: 4,
            borderRadius: 2,
            borderColor: "#FF6B6B",
            color: "#FF6B6B",
            "&:hover": {
              borderColor: "#FF9F43",
              background: "rgba(255,107,107,0.05)",
            },
          }}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}

export default Startup;
