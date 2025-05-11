import React, { useEffect, useState, useContext } from "react";
import {
  Typography,
  Paper,
  Stack,
  Divider,
  List,
  ListItem,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { updatePlan, deletePlan } from "../../services/learningPlanService";
import LearningPlanForm from "../Binuri/LearningPlanForm";

const UserLearningPlans = ({ userId }) => {
  const { user } = useContext(AuthContext);
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formResetTrigger, setFormResetTrigger] = useState(0);

  const loadPlans = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/plans");
      const allPlans = res.data._embedded?.learningPlanList || [];
      const filtered = allPlans.filter((plan) => plan.userId === userId);
      setPlans(filtered);
    } catch (err) {
      console.error("❌ Error loading plans:", err);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [userId]);

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleUpdate = async (planData) => {
    try {
      const updatedPlan = {
        ...planData,
        id: editingPlan.id,
        userId: user?.id
      };
      await updatePlan(editingPlan.id, updatedPlan);
      loadPlans();
      handleCloseModal();
      setFormResetTrigger((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to update plan:", err);
    }
  };

  const handleDelete = async (planId) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (!confirm) return;

    try {
      await deletePlan(planId);
      loadPlans(); // Reload plans after deletion
    } catch (err) {
      console.error("Failed to delete plan:", err);
    }
  };

  if (plans.length === 0) {
    return <Typography>No learning plans yet.</Typography>;
  }

  return (
    <>
      <Stack spacing={2}>
        {plans.map((plan) => (
          <Paper key={plan.id} sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              {plan.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {plan.description}
            </Typography>

            {/* Show additional fields */}
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

            <Typography variant="subtitle2" gutterBottom>
              Steps:
            </Typography>
            <List dense>
              {plan.steps.map((step, i) => (
                <ListItem key={i}>
                  {step.step} {step.completed ? "✅" : "❌"}
                </ListItem>
              ))}
            </List>

            {/* Only show edit/delete buttons for user's own plans */}
            {plan.userId === user?.id && (
              <CardActions sx={{ justifyContent: "flex-end", pt: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEdit(plan)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </Button>
              </CardActions>
            )}
          </Paper>
        ))}
      </Stack>

      {/* Edit Plan Modal */}
      <Dialog 
        open={isModalOpen} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Learning Plan
        </DialogTitle>
        <DialogContent>
          {editingPlan && (
            <LearningPlanForm
              onSubmit={handleUpdate}
              editingPlan={editingPlan}
              onCancel={handleCloseModal}
              resetTrigger={formResetTrigger}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserLearningPlans;