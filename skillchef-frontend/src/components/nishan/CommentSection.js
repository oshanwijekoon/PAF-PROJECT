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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

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

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Comments
      </Typography>

      <Stack spacing={2} mb={3}>
        {comments.length === 0 ? (
          <Typography color="text.secondary">No comments yet.</Typography>
        ) : (
          comments.map((comment) => (
            <Box
              key={comment.id}
              sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  src={`http://localhost:8080${
                    comment.userInfo?.profilePic || ""
                  }`}
                  alt={comment.userInfo?.username}
                />
                <Typography variant="subtitle2">
                  {comment.userInfo?.username || comment.username}
                </Typography>
              </Stack>

              {/* 🆕 Add createdAt below username */}
              <Typography variant="caption" color="text.secondary">
                {new Date(comment.createdAt).toLocaleString()}
              </Typography>

              {editId === comment.id ? (
                <>
                  <TextField
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    fullWidth
                    multiline
                    sx={{ mt: 1 }}
                  />
                  <Stack direction="row" spacing={1} mt={1}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleSaveEdit}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </Button>
                  </Stack>
                </>
              ) : (
                <>
                  <Typography variant="body2" mt={1}>
                    {comment.text}
                  </Typography>
                  {comment.userId === user?.id && (
                    <Stack direction="row" spacing={1} mt={1}>
                      <IconButton onClick={() => handleEdit(comment)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(comment.id)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    </Stack>
                  )}
                </>
              )}
            </Box>
          ))
        )}
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button variant="contained" onClick={handleAddComment}>
          Post
        </Button>
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
