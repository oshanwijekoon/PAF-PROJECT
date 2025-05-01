import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function EditPost() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const post = state?.post;

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    hashtags: "",
  });

  const [files, setFiles] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        description: post.description,
        category: post.category,
        difficulty: post.difficulty,
        hashtags: post.hashtags?.join(", ") || "",
      });
    }
  }, [post]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post) return;

    // 🚨 Confirmation dialog
    const confirmUpdate = window.confirm(
      "Are you sure you want to update this post?"
    );
    if (!confirmUpdate) return;

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("difficulty", form.difficulty);
    formData.append("userId", post.userId);
    formData.append("hashtags", form.hashtags);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.put(
        `http://localhost:8080/api/posts/${post.id}/with-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setToastOpen(true);
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Post ✏️
      </Typography>

      {/* ✅ Show old image if available */}
      {post?.mediaUrls?.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2">Current Image:</Typography>
          <img
            src={`http://localhost:8080${post.mediaUrls[0]}`}
            alt="Current"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            label="Description"
            name="description"
            multiline
            rows={4}
            value={form.description}
            onChange={handleChange}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
          <TextField
            label="Difficulty"
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
          />
          <TextField
            label="Hashtags (comma-separated)"
            name="hashtags"
            value={form.hashtags}
            onChange={handleChange}
          />

          {/* ✅ New Upload Section */}
          <Button variant="outlined" component="label">
            Upload New Image(s)
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </Button>

          {files.length > 0 && (
            <Typography variant="body2">
              {files.length} new file(s) selected
            </Typography>
          )}

          <Button type="submit" variant="contained" color="primary">
            Update Post
          </Button>
        </Stack>
      </form>

      {/* ✅ Toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="success"
          variant="filled"
        >
          Post updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default EditPost;
