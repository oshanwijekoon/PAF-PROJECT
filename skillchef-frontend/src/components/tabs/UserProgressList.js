import React, { useEffect, useState } from "react";
import { Typography, Paper, Stack, Divider } from "@mui/material";
import axios from "axios";

const UserProgressList = ({ userId }) => {
  const [progressList, setProgressList] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/progress");
        const filtered = res.data.filter((item) => item.userId === userId);
        setProgressList(filtered);
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };
    fetchProgress();
  }, [userId]);

  if (progressList.length === 0) {
    return <Typography>No progress updates yet.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {progressList.map((p) => (
        <Paper key={p.id} sx={{ p: 2 }}>
          <Typography variant="h6">{p.templateType}</Typography>
          <Typography>{p.updateText}</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Rating: {p.rating} | Date: {p.date} | Difficulty:{" "}
            {p.difficultyLevel}
          </Typography>
          {p.nextStep && (
            <Typography variant="body2" mt={1}>
              ➡️ Next Step: {p.nextStep}
            </Typography>
          )}
        </Paper>
      ))}
    </Stack>
  );
};

export default UserProgressList;
