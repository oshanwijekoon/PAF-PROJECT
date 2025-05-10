import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../components/Oshan/PostCard";
import CommentSection from "../components/Senura/CommentSection";
import { Container, CircularProgress, Box, Paper } from "@mui/material";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate(); // Add this
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Failed to load post:", err));
  }, [id]);

  if (!post) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
        <PostCard post={post} onDelete={() => navigate("/home")} />
      </Paper>
      
      <Paper elevation={3} sx={{ mt: 4 }}>
        <CommentSection postId={post.id} showAllComments={true} />
      </Paper>
    </Container>
  );
}

export default PostDetail;
