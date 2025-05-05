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
  MenuItem,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import RestaurantIcon from '@mui/icons-material/Restaurant';
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

  const categories = [
    "Main Course",
    "Appetizer",
    "Dessert",
    "Breakfast",
    "Lunch",
    "Dinner",
    "Snack",
    "Beverage",
    "Soup",
    "Salad",
    "Baked Goods",
  ];

  const difficultyLevels = [
    "Beginner",
    "Easy",
    "Intermediate",
    "Advanced",
    "Expert"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const [previewUrls, setPreviewUrls] = useState([]);

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
    
    // Create preview URLs
    const urls = validImages.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const addHashtag = (tag) => {
    if (!tag.startsWith('#')) tag = '#' + tag;
    const currentTags = form.hashtags ? form.hashtags.split(',').map(t => t.trim()) : [];
    if (!currentTags.includes(tag)) {
      setForm({
        ...form,
        hashtags: [...currentTags, tag].join(', ')
      });
    }
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
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff, #f5f5f5)',
          boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <RestaurantIcon sx={{ fontSize: 40, color: '#FF6B6B', mb: 2 }} />
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Create Your Post
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
            Share your culinary masterpiece with the world 🌎
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <Stack spacing={4}>
            <TextField
              label="Recipe Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              required
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(255,107,107,0.05)',
                  '&:hover': {
                    bgcolor: 'rgba(255,107,107,0.1)',
                  },
                }
              }}
            />

            <TextField
              label="Recipe Description"
              name="description"
              multiline
              rows={4}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              required
              variant="filled"
              sx={{
                '& .MuiFilledInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(255,107,107,0.05)',
                }
              }}
            />

            {/* Image Preview Section */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#FF6B6B' }}>
                Upload Your Photos
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: 2,
                  mb: 2,
                }}
              >
                {previewUrls.map((url, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      paddingTop: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      }}
                      size="small"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                {previewUrls.length < 3 && (
                  <Button
                    component="label"
                    sx={{
                      height: 0,
                      paddingTop: '100%',
                      position: 'relative',
                      border: '2px dashed #FF9F43',
                      borderRadius: 2,
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ color: '#FF9F43', mb: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        Add Photo
                      </Typography>
                    </Box>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                )}
              </Box>
            </Box>

            {/* Category and Difficulty */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                select
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
              >
                {categories.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
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
              >
                {difficultyLevels.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* Hashtags Section */}
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: '#FF6B6B' }}>
                Recipe Tags
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {form.hashtags.split(',').map((tag, index) => (
                  tag.trim() && (
                    <Chip
                      key={index}
                      label={tag.trim()}
                      sx={{
                        bgcolor: 'rgba(255,107,107,0.1)',
                        color: '#FF6B6B',
                        m: 0.5,
                      }}
                    />
                  )
                ))}
              </Stack>
              <TextField
                fullWidth
                label="Add Tags"
                name="hashtags"
                value={form.hashtags}
                onChange={handleChange}
                error={!!errors.hashtags}
                helperText={errors.hashtags || "Separate tags with commas (e.g., #italian, #pasta)"}
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    borderRadius: 2,
                    bgcolor: 'rgba(255,107,107,0.05)',
                  }
                }}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                borderRadius: 3,
                background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
                boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
                },
              }}
            >
              Share Recipe
            </Button>
          </Stack>
        </Box>
      </Paper>

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
