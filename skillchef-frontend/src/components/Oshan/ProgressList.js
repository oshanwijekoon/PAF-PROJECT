import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";

const ProgressList = ({ updates, onEdit, onDelete, onToggle }) => {
  if (!updates.length) {
    return <Typography>No progress updates yet.</Typography>;
  }

  return (
    <Stack spacing={3}>
      {updates.map((progress) => (
        <Card key={progress.id} variant="outlined" sx={{ boxShadow: 2 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="h6">{progress.templateType}</Typography>
              <Chip
                label={progress.difficultyLevel}
                color={
                  progress.difficultyLevel === "Easy"
                    ? "success"
                    : progress.difficultyLevel === "Medium"
                    ? "warning"
                    : "error"
                }
              />
            </Stack>

            <Typography variant="body1" gutterBottom>
              {progress.updateText}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Plan: <strong>{progress.planId}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Date: {dayjs(progress.date).format("YYYY-MM-DD")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rating: ⭐ {progress.rating}/5
            </Typography>

            {progress.nextStep && (
              <Typography variant="body2" mt={1}>
                🔜 <strong>Next Step:</strong> {progress.nextStep}
              </Typography>
            )}

            <Box mt={2}>
              <Typography
                variant="body2"
                sx={{
                  color: progress.completed ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                {progress.completed ? "✅ Completed" : "⏳ In Progress"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} mt={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                size="small"
                onClick={() => onEdit(progress)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => onDelete(progress.id)}
              >
                Delete
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ProgressList;
