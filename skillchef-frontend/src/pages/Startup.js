import React from "react";
import { Box, Button, Typography, Container, Paper, Grid, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShareIcon from '@mui/icons-material/Share';

function Startup() {
  const navigate = useNavigate();

  const features = [
    { icon: <MenuBookIcon sx={{ fontSize: 40 }}/>, title: "Learn Recipes", desc: "Access a vast collection of recipes" },
    { icon: <GroupsIcon sx={{ fontSize: 40 }}/>, title: "Join Community", desc: "Connect with fellow food enthusiasts" },
    { icon: <ShareIcon sx={{ fontSize: 40 }}/>, title: "Share Skills", desc: "Share your culinary expertise" }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fff5f5 0%, #fff0ea 100%)',
      pt: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '90vh' }}>
          <Grid item xs={12} md={6}>
            <Stack spacing={4}>
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#2D3436',
                    lineHeight: 1.2,
                    mb: 2,
                    background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <RestaurantMenuIcon sx={{ fontSize: 50, color: '#FF6B6B' }}/>
                  SkillChef
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 500,
                    color: '#636E72',
                    mb: 3,
                    lineHeight: 1.4,
                  }}
                >
                  Master the Art of Cooking Together
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Join our community of passionate chefs, share your recipes, learn new skills, 
                  and explore the world of culinary arts.
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/login")}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    background: 'linear-gradient(45deg, #FF6B6B, #FF9F43)',
                    boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                    transition: 'all 0.3s ease',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(255,107,107,0.4)',
                    },
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    borderColor: '#FF6B6B',
                    color: '#FF6B6B',
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    '&:hover': {
                      borderColor: '#FF9F43',
                      background: 'rgba(255,107,107,0.05)',
                    },
                  }}
                >
                  Join Community
                </Button>
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      borderRadius: 4,
                      background: 'rgba(255,255,255,0.8)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,107,107,0.1)',
                      transition: 'all 0.3s ease',
                      textAlign: 'center',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 10px 20px rgba(255,107,107,0.1)',
                      },
                    }}
                  >
                    <Box sx={{ color: '#FF6B6B', mb: 2 }}>{feature.icon}</Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Startup;
