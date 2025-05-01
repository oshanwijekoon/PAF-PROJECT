import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Box } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

function MainLayout() {
  const { user } = useContext(AuthContext);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <Navbar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: user ? "220px" : 0 }, // responsive left margin if sidebar exists
        }}
      >
        {/* Fixed Navbar with z-index */}
        {user && <Sidebar />}
        {/* Padding for content to appear below the fixed navbar */}
        <Box sx={{ p: 3, pt: "80px" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;
