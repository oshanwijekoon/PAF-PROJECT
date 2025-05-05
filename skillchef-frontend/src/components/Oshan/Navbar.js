import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  InputBase,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      variant="permanent"
      sx={{
        bgcolor: "rgb(199, 195, 194)", // Bright orange
        color: "#000",
        px: 0,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {/* 🍳 Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "black",
              fontWeight: 700,
              ml: 30,
            }}
          >
            SkillChef 👨‍🍳
          </Typography>

          {/* 🔍 Search bar */}
          {user && !isMobile && (
            <Box
              sx={{
                bgcolor: "#fff",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                width: 300,
                mx: 2,
              }}
            >
              <SearchIcon color="action" />
              <InputBase
                placeholder="Search posts or users…"
                sx={{ ml: 1, flex: 1 }}
              />
            </Box>
          )}

          {/* 👤 User Section */}
          <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
            {user ? (
              <>
                <Stack alignItems="flex-end" spacing={0}>
                  <Typography fontSize="14px" color="black">
                    Welcome, <strong>{user.username || user.email}</strong>
                  </Typography>
                  <Typography fontSize="12px" color="black">
                    {user.email}
                  </Typography>
                </Stack>

                {/* Avatar Clickable to Profile */}
                <Box
                  component={Link}
                  to={`/account/${user.id}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <Avatar
                    alt={user.username}
                    src={`http://localhost:8080${user.profilePic}`}
                    sx={{ width: 36, height: 36 }}
                  />
                </Box>

                <Button
                  color="inherit"
                  component={Link}
                  to={`/account/${user.id}`}
                  sx={{ minWidth: 90 }}
                >
                  My Profile
                </Button>
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
