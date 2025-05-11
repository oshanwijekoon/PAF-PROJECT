import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Paper, Box, Grid } from '@mui/material';
import { auth } from '../config/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import GoogleIcon from '@mui/icons-material/Google';

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      
      if (!result.user.email) {
        throw new Error("No email provided from Google");
      }
      
      // Send Google user data to your backend
      const res = await axios.post(
        "http://localhost:8080/api/users/google-login",
        {
          email: result.user.email,
          username: result.user.displayName || result.user.email.split('@')[0],
          profilePic: result.user.photoURL || "/uploads/default.jpg",
        }
      );

      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      login(user);
      navigate("/home");
    } catch (err) {
      console.error("Google sign-in error:", err);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Google sign-in failed. Please try again."
      );
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8080/api/users/login",
        form
      );

      const user = res.data;

      // ✅ Save to localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Trigger login in context (if using)
      login && login(user);

      navigate("/home");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          p: 4,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              mb: 1,
            }}
          >
            Welcome Back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to continue your culinary journey
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#FF6B6B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B6B',
                }
              }
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#FF6B6B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#FF6B6B',
                }
              }
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #FF5B5B, #FF8F33)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(255,107,107,0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Sign In
          </Button>
        </form>

        <Divider sx={{ my: 3 }}>OR</Divider>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleSignIn}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.5,
            borderRadius: '12px',
            borderColor: '#FF6B6B',
            color: '#FF6B6B',
            textTransform: 'none',
            fontSize: '1.1rem',
            '&:hover': {
              borderColor: '#FF9F43',
              backgroundColor: 'rgba(255,107,107,0.05)',
            },
          }}
        >
          Continue with Google
        </Button>

        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
}

export default Login;
