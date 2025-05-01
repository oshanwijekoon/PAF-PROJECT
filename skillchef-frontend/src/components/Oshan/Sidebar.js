import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Home,
  Search,
  FavoriteBorder,
  AddBox,
  AccountCircle,
  Assignment,
  TrendingUp,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Sidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    { label: "Home", icon: <Home />, path: "/home" },
    { label: "Search", icon: <Search />, path: "/search" },
    {
      label: "Notifications",
      icon: <FavoriteBorder />,
      path: "/notifications",
    },
    { label: "Create", icon: <AddBox />, path: "/create" },
    { label: "Progress", icon: <TrendingUp />, path: "/progress" },
    { label: "Planning", icon: <Assignment />, path: "/learning-plans" },
    { label: "Profile", icon: <AccountCircle />, path: `/account/${user?.id}` },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 2,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          borderRight: "1px solid #ddd",
          pt: 2,
          bgcolor: "rgb(255, 255, 255)",
        },
      }}
    >
      <Box textAlign="center" mb={2}>
        <Typography variant="h6" fontWeight="bold">
        Menu
        </Typography>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.label}
            button
            component={Link}
            to={item.path}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                bgcolor: "#f5f5f5",
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>

      {/* User + Logout */}
      <Box mt="auto" p={2} textAlign="center">
        {user && (
          <>
            <Avatar
              src={`http://localhost:8080${user.profilePic}`}
              alt={user.username}
              sx={{ width: 40, height: 40, mx: "auto", mb: 1 }}
            />
            <Typography fontSize={14} fontWeight={500}>
              {user.username}
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              {user.email}
            </Typography>
            <Typography
              mt={1}
              fontSize={13}
              color="error.main"
              sx={{ cursor: "pointer" }}
              onClick={handleLogout}
            >
              Logout
            </Typography>
          </>
        )}
      </Box>
    </Drawer>
  );
}

export default Sidebar;
