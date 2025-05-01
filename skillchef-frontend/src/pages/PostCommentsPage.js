import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Snackbar, Alert } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import {
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "../../services/commentService";
import CommentForm from "../components/nishan/CommentForm";
import CommentList from "../components/nishan/CommentList";

const PostCommentsPage = () => {
  const { user } = useContext(AuthContext);
  const { postId } = useParams();

  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
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
      const res = await getCommentsByPost(postId);
      setComments(res.data._embedded?.commentList || []);
    } catch (err) {
      console.error("❌ Error loading comments:", err);
      showToast("Failed to load comments", "error");
    }
  };

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const handleCreate = async (formData) => {
    try {
      await createComment(postId, formData.text, user);
      showToast("Comment posted!");
      loadComments();
    } catch (err) {
      console.error(err);
      showToast("Error creating comment", "error");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateComment(editingComment.id, formData.text);
      setEditingComment(null);
      showToast("Comment updated!");
      loadComments();
    } catch (err) {
      console.error(err);
      showToast("Error updating comment", "error");
    }
  };

  const handleSubmit = (formData) => {
    if (editingComment) {
      handleUpdate(formData);
    } else {
      handleCreate(formData);
    }
  };

  const handleEdit = (comment) => {
    setEditingComment(comment);
  };

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm("Delete this comment?");
    if (!confirmDelete) return;

    try {
      await deleteComment(commentId);
      showToast("Comment deleted!");
      loadComments();
    } catch (err) {
      console.error(err);
      showToast("Error deleting comment", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        💬 Comments
      </Typography>

      <CommentForm
        onSubmit={handleSubmit}
        editingComment={editingComment}
        onCancel={handleCancelEdit}
      />

      <CommentList
        comments={comments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentUserId={user?.id}
      />

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
    </Container>
  );
};

export default PostCommentsPage;
