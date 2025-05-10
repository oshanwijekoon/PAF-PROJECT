import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
  Paper,
  Fade,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import EmojiPicker from "./EmojiPicker";

function CommentSection({ postId, limit }) {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  const loadComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/comments/post/${postId}`
      );
      const list = res.data._embedded?.commentList || [];
      const limitedList = limit ? list.slice(0, limit) : list;

      // Fetch user info for each comment
      const enriched = await Promise.all(
        limitedList.map(async (comment) => {
          try {
            const userRes = await axios.get(
              `http://localhost:8080/api/users/${comment.userId}`
            );
            return { ...comment, userInfo: userRes.data };
          } catch {
            return comment;
          }
        })
      );

      setComments(enriched);
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post("http://localhost:8080/api/comments", {
        postId,
        userId: user.id,
        username: user.username,
        text: newComment,
      });
      setNewComment("");
      loadComments();
      showToast("Comment posted!");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await axios.delete(`http://localhost:8080/api/comments/${id}`);
      loadComments();
      showToast("🗑️ Comment deleted!");
    } catch (err) {
      showToast("Error deleting comment", "error");
    }
  };

  const handleEdit = (comment) => {
    setEditId(comment.id);
    setEditText(comment.text);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:8080/api/comments/${editId}`, {
        text: editText,
      });
      setEditId(null);
      setEditText("");
      loadComments();
      showToast("✅ Comment updated!");
    } catch (err) {
      showToast("Error updating comment", "error");
    }
  };

  const handleEmojiSelect = (emoji) => {
    if (editId) {
      setEditText(editText + emoji);
    } else {
      setNewComment(newComment + emoji);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, p: 3 }}>
      <Typography variant="h6" mb={3} fontWeight="bold">
        Comments
      </Typography>

      {/* Comment Input */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar src={user?.profilePic} alt={user?.username} />
          <Stack spacing={1} flexGrow={1}>
            <TextField
              fullWidth
              multiline
              rows={2}
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              sx={{ '& fieldset': { borderRadius: 2 } }}
            />
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
              >
                Post
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Comments List */}
      <Stack spacing={2}>
        {comments.map((comment) => (
          <Fade in key={comment.id}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 3 }
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src={comment.userInfo?.profilePic}
                      alt={comment.username}
                    />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {comment.userInfo?.username || comment.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                  {comment.userId === user?.id && (
                    <Stack direction="row" spacing={1}>
                      <IconButton size="small" onClick={() => handleEdit(comment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(comment.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>

                {editId === comment.id ? (
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Stack direction="row" spacing={2}>
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveEdit}
                        startIcon={<SaveIcon />}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => setEditId(null)}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  </Box>
                ) : (
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {comment.text}
                  </Typography>
                )}
              </Stack>
            </Paper>
          </Fade>
        ))}
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.severity} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CommentSection;
