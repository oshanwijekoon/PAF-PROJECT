import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Snackbar,
  Alert,
  Avatar,
  Paper,
  Divider,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [form, setForm] = useState({
    username: "",
    email: "",
    bio: "",
    location: "",
    profilePic: "",
  });

  const [file, setFile] = useState(null);
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8080/api/users/${user.id}`).then((res) => {
        const data = res.data;
        setForm({
          username: data.username || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          profilePic: data.profilePic || "",
        });
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

 const handleUpdate = async () => {
   const confirmUpdate = window.confirm(
     "Are you sure you want to update your profile?"
   );
   if (!confirmUpdate) return;

   try {
     const formData = new FormData();
     formData.append("username", form.username);
     formData.append("bio", form.bio);
     formData.append("location", form.location);
     if (file) formData.append("file", file);

     const res = await axios.put(
       `http://localhost:8080/api/users/${user.id}`,
       formData,
       {
         headers: { "Content-Type": "multipart/form-data" },
       }
     );

     const updated = res.data;
     setForm({
       username: updated.username || "",
       email: updated.email || "",
       bio: updated.bio || "",
       location: updated.location || "",
       profilePic: updated.profilePic || "",
     });

     setToast({
       open: true,
       message: "Profile updated!",
       severity: "success",
     });

     navigate(`/account/${user.id}`);
   } catch (err) {
     setToast({ open: true, message: "Update failed", severity: "error" });
   }
 };

 const handleDelete = async () => {
   const confirmDelete = window.confirm(
     "Are you sure you want to delete your account? This cannot be undone."
   );
   if (!confirmDelete) return;

   try {
     await axios.delete(`http://localhost:8080/api/users/${user.id}`);
     logout();
     navigate("/");
   } catch (err) {
     setToast({ open: true, message: "Delete failed", severity: "error" });
   }
 };


  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          My Profile
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3} alignItems="center">
          <Avatar
            src={`http://localhost:8080${form.profilePic}`}
            alt={form.username}
            sx={{
              width: 100,
              height: 100,
              border: `2px solid ${theme.palette.primary.main}`,
            }}
          />
          <Button variant="outlined" component="label">
            Upload Profile Picture
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>
        </Stack>

        <Stack spacing={2} sx={{ mt: 4 }}>
          <TextField
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            disabled
            fullWidth
          />
          <TextField
            label="Bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={2}
          />
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={2} mt={4} justifyContent="center">
          <Button variant="contained" onClick={handleUpdate}>
            Update Profile
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete Account
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Profile;
