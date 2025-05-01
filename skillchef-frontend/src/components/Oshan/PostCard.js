import React, { useEffect, useState, useContext } from "react";
import CommentSection from "../Senura/CommentSection";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Avatar,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function PostCard({ post, onDelete }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [postUser, setPostUser] = useState(null);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    if (post.userId) {
      axios
        .get(`http://localhost:8080/api/users/${post.userId}`)
        .then((res) => setPostUser(res.data))
        .catch((err) => console.error("Failed to fetch user", err));
    }
  }, [post.userId]);

  const handleEdit = () => {
    navigate(`/edit-post/${post.id}`, { state: { post } });
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${post.id}`);
      onDelete(post.id);
      setToastOpen(true);
      navigate("/home");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleShare = () => {
    const postUrl = `${window.location.origin}/post/${post.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: "Check out this recipe on SkillChef!",
          url: postUrl,
        })
        .catch((err) => console.error("Share failed:", err));
    } else {
      navigator.clipboard.writeText(postUrl);
      setShareToast(true);
    }
  };

  const imageUrl =
    post.mediaUrls?.length > 0
      ? `http://localhost:8080${post.mediaUrls[0]}`
      : null;

  return (
    <>
      <Card
        sx={{
          maxWidth: 500,
          margin: "20px auto",
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        {/* 🧑‍🍳 Top User Info Row */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          px={2}
          pt={2}
        >
          {/* ✅ Only make user info clickable */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(`/account/${post.userId}`)}
          >
            <Avatar
              src={`http://localhost:8080${postUser?.profilePic}`}
              alt={postUser?.username}
            />
            <Typography variant="subtitle2" fontWeight={600}>
              {postUser?.username}
            </Typography>
          </Box>

          {/* 🛠️ Icons (Edit/Delete/Share) */}
          <Stack direction="row" spacing={1}>
            {user?.id === post.userId && (
              <>
                <IconButton color="primary" onClick={handleEdit}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => setConfirmOpen(true)}>
                  <DeleteIcon />
                </IconButton>
              </>
            )}
            <Tooltip title="Share this post">
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* 📷 Post Media */}
        {imageUrl && (
          <CardMedia
            component="img"
            height="300"
            image={imageUrl}
            alt={post.title}
            sx={{ objectFit: "cover", mt: 1 }}
          />
        )}

        <CardContent>
          <Typography variant="h6">{post.title}</Typography>

          {post.difficulty && (
            <Chip
              label={post.difficulty}
              color="secondary"
              size="small"
              sx={{ mt: 1 }}
            />
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {post.description}
          </Typography>

          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {post.hashtags?.map((tag, index) => (
              <Chip
                key={index}
                label={`#${tag}`}
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </CardContent>
        <Button
          variant="text"
          size="small"
          onClick={() => navigate(`/post/${post.id}`)}
          sx={{ mt: 2 }}
        >
          💬 View Comments
        </Button>
      </Card>

      {/* Confirm Delete */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Toast */}
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
          Post deleted successfully!
        </Alert>
      </Snackbar>

      {/* Share Toast */}
      <Snackbar
        open={shareToast}
        autoHideDuration={3000}
        onClose={() => setShareToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShareToast(false)}
          severity="info"
          variant="filled"
        >
          Post link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}

export default PostCard;
