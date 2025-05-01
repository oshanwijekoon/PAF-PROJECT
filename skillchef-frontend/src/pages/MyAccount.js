import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  Stack,
  Button,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Tabs,
  Tab,
  Grid,
  useTheme,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import FollowersModal from "../components/hashan/FollowersModal";
import UserProgressList from "../components/tabs/UserProgressList";
import UserLearningPlans from "../components/tabs/UserLearningPlans";


function MyAccount() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [selectedView, setSelectedView] = useState("POSTS");

  const navigate = useNavigate();
  const theme = useTheme();
  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/users/${id || user.id}`
        );
        setProfile(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err.message);
        alert("Failed to load profile.");
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/posts/user/${id || user.id}`
        );
        setPosts(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch user posts:", err.message);
      }
    };

    if (user) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [id, user]);

  const isFollowing = profile?.followers?.some(
    (followerId) => followerId === user?.id
  );

  const handleFollowToggle = async () => {
    if (!user || !profile) return;
    try {
      setLoading(true);
      const url = `http://localhost:8080/api/users/${user.id}/${
        isFollowing ? "unfollow" : "follow"
      }/${profile.id}`;
      await axios.put(url);
      const updated = await axios.get(
        `http://localhost:8080/api/users/${profile.id}`
      );
      setProfile(updated.data);
    } catch (err) {
      console.error("Follow/unfollow error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={4}
        sx={{
          p: 5,
          borderRadius: 5,
          background: theme.palette.background.paper,
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} textAlign="center">
            <Avatar
              src={`http://localhost:8080${profile.profilePic}`}
              sx={{
                width: 120,
                height: 120,
                border: `3px solid ${theme.palette.primary.main}`,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight="bold">
              {profile.username}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {profile.email}
            </Typography>
            {profile.bio && (
              <Typography variant="body2" mt={1}>
                {profile.bio}
              </Typography>
            )}
            {profile.location && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                📍 {profile.location}
              </Typography>
            )}

            <Stack direction="row" spacing={4} mt={2}>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => setShowFollowers(true)}
              >
                <strong>{profile.followers?.length || 0}</strong> Followers
              </Typography>
              <Typography
                sx={{ cursor: "pointer" }}
                onClick={() => setShowFollowing(true)}
              >
                <strong>{profile.following?.length || 0}</strong> Following
              </Typography>
            </Stack>

            {!isOwnProfile && (
              <Box mt={2}>
                <Button
                  variant="contained"
                  color={isFollowing ? "error" : "primary"}
                  onClick={handleFollowToggle}
                  disabled={loading}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </Button>
              </Box>
            )}

            {isOwnProfile && (
              <Box mt={2}>
                <Button variant="outlined" onClick={() => navigate("/profile")}>
                  Manage My Account
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      <FollowersModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        userIds={profile.followers}
        title="Followers"
      />
      <FollowersModal
        open={showFollowing}
        onClose={() => setShowFollowing(false)}
        userIds={profile.following}
        title="Following"
      />

      <Paper elevation={3} sx={{ mt: 5, p: 3, borderRadius: 4 }}>
        <Tabs
          value={selectedView}
          onChange={(e, newVal) => setSelectedView(newVal)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab value="POSTS" label="Posts" />
          <Tab value="PROGRESS" label="Learning Progress" />
          <Tab value="PLAN" label="Learning Plan Sharing" />
        </Tabs>

        <Divider sx={{ mt: 2, mb: 3 }} />

        {selectedView === "POSTS" && (
          <Grid container spacing={2}>
            {posts.length > 0 ? (
              posts.map((post) =>
                post.mediaUrls?.[0] ? (
                  <Grid item xs={4} key={post.id}>
                    <img
                      src={`http://localhost:8080${post.mediaUrls[0]}`}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(`/post/${post.id}`)}
                    />
                  </Grid>
                ) : null
              )
            ) : (
              <Typography color="text.secondary" align="center" width="100%">
                No posts to show.
              </Typography>
            )}
          </Grid>
        )}
        {selectedView === "PROGRESS" && (
          <UserProgressList userId={profile.id} />
        )}

        {selectedView === "PLAN" && (
          <UserLearningPlans userId={profile.id} />
        )}
      </Paper>
    </Container>
  );
}

export default MyAccount;
