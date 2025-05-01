import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import PostCard from "../components/Oshan/PostCard";
import {
  Container,
  Typography,
  Grid,
  Box,
  Avatar,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/posts").then((res) => {
      // Sort posts newest first
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
    });

    if (user?.id) {
      axios
        .get(`http://localhost:8080/api/users/suggestions/${user.id}`)
        .then((res) => setSuggestedUsers(res.data))
        .catch((err) => console.error("Failed to fetch suggestions", err));
    }
  }, [user]);

  const handlePostDelete = (deletedId) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedId));
  };

  const handleFollow = async (targetId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/users/${user.id}/follow/${targetId}`
      );
      setSuggestedUsers((prev) => prev.filter((u) => u.id !== targetId));
    } catch (err) {
      console.error("Follow failed", err);
    }
  };

  return (
    <Container sx={{ mt: 4, ml: 30 }}>
      <Grid container spacing={3}>
        {/* Left Side - Posts */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            SkillChef Feed 🍳
          </Typography>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={handlePostDelete} />
          ))}
        </Grid>

        {/* Right Side - Suggested Users (Sticky) */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              position: "sticky",
              top: 90,
              maxHeight: "calc(100vh - 100px)",
              overflow: "auto",
              ml: 11,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Suggested Followers
            </Typography>
            <Stack spacing={2}>
              {suggestedUsers.map((u) => (
                <Box
                  key={u.id}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: "pointer", mr: 3 }}
                    onClick={() => navigate(`/account/${u.id}`)}
                  >
                    <Avatar src={`http://localhost:8080${u.profilePic}`} />
                    <Typography>{u.username}</Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleFollow(u.id)}
                  >
                    Follow
                  </Button>
                </Box>
              ))}
              {suggestedUsers.length === 0 && (
                <Typography color="text.secondary" fontSize="14px">
                  No suggestions right now.
                </Typography>
              )}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
