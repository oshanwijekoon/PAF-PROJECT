import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Paper, Box, Grid } from "@mui/material";
function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    bio: "",
    profilePic: "/uploads/default.jpg",
    location: "",
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/users/register", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background:
            "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background:
                "linear-gradient(45deg, #FF6B6B, #FF9F43)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            Join SkillChef 🧑‍🍳
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create your account and start sharing your culinary passion
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#FF6B6B" },
                    "&.Mui-focused fieldset": { borderColor: "#FF6B6B" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#FF6B6B" },
                    "&.Mui-focused fieldset": { borderColor: "#FF6B6B" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#FF6B6B" },
                    "&.Mui-focused fieldset": { borderColor: "#FF6B6B" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                multiline
                rows={3}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#FF6B6B" },
                    "&.Mui-focused fieldset": { borderColor: "#FF6B6B" },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={form.location}
                onChange={handleChange}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    "&:hover fieldset": { borderColor: "#FF6B6B" },
                    "&.Mui-focused fieldset": { borderColor: "#FF6B6B" },
                  },
                }}
              />
            </Grid>
          </Grid>

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 4,
              py: 1.5,
              borderRadius: "12px",
              background:
                "linear-gradient(45deg, #FF6B6B, #FF9F43)",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 600,
              "&:hover": {
                background:
                  "linear-gradient(45deg, #FF5B5B, #FF8F33)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(255,107,107,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Create Account
          </Button>
        </form>

        <Snackbar open={success} autoHideDuration={3000}>
          <Alert severity="success">Registration Successful!</Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Register;
