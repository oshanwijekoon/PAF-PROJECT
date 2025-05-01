import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostForm() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    hashtags: "",
  });

  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 3) {
      setToast({
        open: true,
        message: "You can upload a maximum of 3 images.",
        severity: "error",
      });
      return;
    }

    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (validImages.length !== selectedFiles.length) {
      setToast({
        open: true,
        message: "Only image files are allowed.",
        severity: "error",
      });
      return;
    }

    setFiles(validImages);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (form.hashtags && !/^#[a-zA-Z0-9_, ]*$/.test(form.hashtags)) {
      newErrors.hashtags = "Hashtags must be comma-separated and start with #";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("difficulty", form.difficulty);
    formData.append("hashtags", form.hashtags);
    formData.append("userId", user?.id);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.post("http://localhost:8080/api/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setToast({
        open: true,
        message: "Post created successfully!",
        severity: "success",
      });

      setForm({
        title: "",
        description: "",
        category: "",
        difficulty: "",
        hashtags: "",
      });
      setFiles([]);

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Error creating post",
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          textAlign: 'center',
          mb: 4,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Share Your Culinary Creation 👨‍🍳
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Inspire others with your delicious recipes and cooking adventures
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          bgcolor: '#fff',
          p: 4,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          '& .MuiTextField-root': {
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#FF6B6B',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF9F43',
              },
            },
          },
        }}
      >
        <TextField
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={!!errors.title}
          helperText={errors.title}
          required
          sx={{
            '& label.Mui-focused': {
              color: '#FF6B6B',
            },
          }}
        />
        <TextField
          label="Description"
          name="description"
          multiline
          rows={4}
          value={form.description}
          onChange={handleChange}
          error={!!errors.description}
          helperText={errors.description}
          required
          sx={{
            '& label.Mui-focused': {
              color: '#FF6B6B',
            },
          }}
        />
        <TextField
          label="#Hashtags (comma separated)"
          name="hashtags"
          value={form.hashtags}
          onChange={handleChange}
          error={!!errors.hashtags}
          helperText={errors.hashtags || "Example: #spicy, #seafood"}
          sx={{
            '& label.Mui-focused': {
              color: '#FF6B6B',
            },
          }}
        />

        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2}
          sx={{ width: '100%' }}
        >
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            sx={{
              '& label.Mui-focused': {
                color: '#FF6B6B',
              },
            }}
          />
          <TextField
            label="Difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            fullWidth
            sx={{
              '& label.Mui-focused': {
                color: '#FF6B6B',
              },
            }}
          />
        </Stack>

        <Box
          sx={{
            border: '2px dashed #FF9F43',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255,159,67,0.1)',
            },
          }}
        >
          <Button
            component="label"
            sx={{
              width: '100%',
              height: '100%',
              color: '#FF6B6B',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Box>
              <Typography variant="h6" color="#FF6B6B" gutterBottom>
                📸 Add Photos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Drop your food photos here or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (Maximum 3 images)
              </Typography>
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>
          </Button>
        </Box>

        {files.length > 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ textAlign: 'center' }}
          >
            ✅ {files.length} delicious {files.length === 1 ? 'photo' : 'photos'} selected
          </Typography>
        )}

        <Button 
          type="submit" 
          variant="contained"
          sx={{
            mt: 2,
            py: 1.5,
            background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              background: 'linear-gradient(45deg, #FF5252, #FF9F43)',
            },
          }}
        >
          Share Your Recipe
        </Button>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default PostForm;
