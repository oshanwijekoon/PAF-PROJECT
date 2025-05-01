import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/Oshan/PostCard";
import CommentSection from "../components/Senura/CommentSection"; // 👈 Add this
import { Container, CircularProgress, Box } from "@mui/material";
import axios from "axios";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/posts/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error("Failed to load post:", err));
  }, [id]);

  if (!post) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <PostCard post={post} onDelete={() => (window.location.href = "/home")} />
      <Box sx={{ maxHeight: 400, overflowY: "auto", mt: 4 }}>
        <CommentSection postId={post.id} showAllComments={true} />
      </Box>
    </Container>
  );
}

export default PostDetail;
