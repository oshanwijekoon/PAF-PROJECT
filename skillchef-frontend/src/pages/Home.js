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
  Fade,
  Chip,
  IconButton,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [trendingTags, setTrendingTags] = useState(['#ChefLife', '#Cooking101', '#FoodArt', '#RecipeShare']);
  const [selectedCategory, setSelectedCategory] = useState('all');

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
      {/* Hero Section */}
      <Fade in timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)',
            color: 'white',
          }}
        >
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            Welcome to SkillChef 👨‍🍳
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Discover amazing recipes, share your culinary journey, and connect with fellow food lovers
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/create')}
            sx={{ fontWeight: 'bold' }}
          >
            Share Your Recipe
          </Button>
        </Paper>
      </Fade>

      {/* Categories */}
      <Box sx={{ mb: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {['all', 'trending', 'desserts', 'main course', 'beverages'].map(category => (
          <Chip
            key={category}
            label={category.charAt(0).toUpperCase() + category.slice(1)}
            onClick={() => setSelectedCategory(category)}
            color={selectedCategory === category ? "primary" : "default"}
            icon={category === 'trending' ? <WhatshotIcon /> : null}
            sx={{ px: 1 }}
          />
        ))}
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Trending Topics */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalFireDepartmentIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Trending Topics</Typography>
            </Box>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {trendingTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  clickable
                  sx={{ m: 0.5 }}
                />
              ))}
            </Stack>
          </Paper>

          {/* Posts Feed */}
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            Latest Recipes
          </Typography>
          
          <Stack spacing={3}>
            {posts.map((post) => (
              <Fade in key={post.id} timeout={500}>
                <Box>
                  <PostCard post={post} onDelete={handlePostDelete} />
                </Box>
              </Fade>
            ))}
          </Stack>
        </Grid>

        {/* Suggested Users Section - Modern Style */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              position: "sticky",
              top: 90,
              borderRadius: 3,
              maxHeight: "calc(100vh - 100px)",
              overflow: "auto",
              ml: 11,
              background: theme.palette.background.paper,
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Chefs to Follow
            </Typography>
            <Stack spacing={2}>
              {suggestedUsers.map((u) => (
                <Paper
                  key={u.id}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={1.5}
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate(`/account/${u.id}`)}
                    >
                      <Avatar
                        src={`http://localhost:8080${u.profilePic}`}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {u.username}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {u.bio?.slice(0, 30)}...
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleFollow(u.id)}
                      sx={{ borderRadius: 5 }}
                    >
                      Follow
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
