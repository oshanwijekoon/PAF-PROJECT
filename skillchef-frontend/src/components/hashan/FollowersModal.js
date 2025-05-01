import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FollowersModal({ open, onClose, userIds = [], title = "Followers" }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!open || userIds.length === 0) {
        setUsers([]);
        return;
      }

      try {
        setLoading(true);
        const promises = userIds.map((id) =>
          axios.get(`http://localhost:8080/api/users/${id}`)
        );
        const responses = await Promise.all(promises);
        const userData = responses.map((res) => res.data);
        setUsers(userData);
      } catch (err) {
        console.error("❌ Failed to load followers:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [open, userIds]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        {title}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box textAlign="center" my={2}>
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography align="center" color="text.secondary">
            No {title.toLowerCase()} found.
          </Typography>
        ) : (
          <List>
            {users.map((u) => (
              <ListItem
                button
                key={u.id}
                onClick={() => {
                  onClose();
                  navigate(`/account/${u.id}`);
                }}
              >
                <ListItemAvatar>
                  <Avatar src={`http://localhost:8080${u.profilePic}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={u.username}
                  secondary={u.email}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FollowersModal;
