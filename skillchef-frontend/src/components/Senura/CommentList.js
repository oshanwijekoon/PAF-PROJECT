import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CommentList = ({ comments, onEdit, onDelete, currentUserId }) => {
  if (!comments || comments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No comments yet.
      </Typography>
    );
  }

  return (
    <Stack spacing={2} mt={2}>
      {comments.map((comment) => (
        <Paper key={comment.id} elevation={2} sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography variant="subtitle2">{comment.username}</Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {comment.text}
              </Typography>
            </Box>

            {/* ✏️ Only show edit/delete for comment owner */}
            {currentUserId === comment.userId && (
              <Stack direction="row" spacing={1}>
                <IconButton size="small" onClick={() => onEdit(comment)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(comment.id)}>
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <Divider sx={{ mt: 1 }} />
        </Paper>
      ))}
    </Stack>
  );
};

export default CommentList;
