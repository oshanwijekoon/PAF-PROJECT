import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
} from "@mui/material";
import axios from "axios";

const UserLearningPlans = ({ userId }) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/plans");
        const allPlans = res.data._embedded?.learningPlanList || [];

        const filtered = allPlans.filter((plan) => plan.userId === userId);
        setPlans(filtered);
      } catch (err) {
        console.error("❌ Error loading plans:", err);
      }
    };

    fetchPlans();
  }, [userId]);

  if (plans.length === 0) {
    return <Typography>No learning plans yet.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {plans.map((plan) => (
        <Paper key={plan.id} sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            {plan.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {plan.description}
          </Typography>

          {/* ✨ Show additional fields */}
          {plan.category && (
            <Typography variant="body2" color="text.secondary">
              📂 Category: {plan.category}
            </Typography>
          )}
          {plan.goal && (
            <Typography variant="body2" color="text.secondary">
              🎯 Goal: {plan.goal}
            </Typography>
          )}
          {plan.durationInDays && (
            <Typography variant="body2" color="text.secondary">
              🕒 Duration: {plan.durationInDays} days
            </Typography>
          )}
          {plan.startDateTime && (
            <Typography variant="body2" color="text.secondary">
              📅 Start: {new Date(plan.startDateTime).toLocaleString()}
            </Typography>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Steps:
          </Typography>
          <List dense>
            {plan.steps.map((step, i) => (
              <ListItem key={i}>
                {step.step} {step.completed ? "✅" : "❌"}
              </ListItem>
            ))}
          </List>
        </Paper>
      ))}
    </Stack>
  );
};

export default UserLearningPlans;
