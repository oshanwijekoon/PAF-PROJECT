import React, { useEffect, useState, useContext } from "react";
import {
  getAllPlans,
  createPlan,
  deletePlan,
  updatePlan,
} from "../services/learningPlanService";
import LearningPlanForm from "../components/Binuri/LearningPlanForm";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

import {
  Snackbar,
  Alert,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  Container,
} from "@mui/material";

const LearningPlanPage = () => {
  const { user } = useContext(AuthContext); // ✅ get logged-in user
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formResetTrigger, setFormResetTrigger] = useState(0);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const closeToast = () => {
    setToast({ ...toast, open: false });
  };

  const loadPlans = async () => {
    try {
      const data = await getAllPlans();
      setPlans(data); // Remove the filter to show all plans
    } catch (err) {
      showToast("Failed to load plans", "error");
    }
  };

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user]);

  const handleCreate = async (planData) => {
    try {
      const newPlan = {
        ...planData,
        userId: user?.id,
        steps: planData.steps || []
      };
      await createPlan(newPlan);
      loadPlans();
      setEditingPlan(null);
      setFormResetTrigger((prev) => prev + 1);
      showToast("Plan created successfully!");
    } catch (err) {
      showToast("Failed to create plan", "error");
    }
  };

  const handleUpdate = async (planData) => {
    try {
      if (!editingPlan?.id) {
        throw new Error("Missing plan ID");
      }
      const updatedPlan = {
        ...planData,
        id: editingPlan.id,
        userId: user?.id
      };
      await updatePlan(editingPlan.id, updatedPlan);
      setEditingPlan(null);
      loadPlans();
      setFormResetTrigger((prev) => prev + 1);
      showToast("Plan updated successfully!");
    } catch (err) {
      showToast("Failed to update plan", "error");
    }
  };

  const handleSubmit = (planData) => {
    if (editingPlan?.id) {
      handleUpdate(planData);
    } else {
      handleCreate(planData);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this plan?"
    );
    if (!confirm) return;

    try {
      await deletePlan(id);
      loadPlans();
      showToast("Plan deleted successfully!");
    } catch (err) {
      showToast("Failed to delete plan", "error");
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  const handleToggleStep = async (planId, stepIndex) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const updatedSteps = [...plan.steps];
    updatedSteps[stepIndex].completed = !updatedSteps[stepIndex].completed;

    const updatedPlan = {
      ...plan,
      steps: updatedSteps,
    };

    try {
      await updatePlan(planId, updatedPlan);
      loadPlans();
      showToast("Step updated!", "info");
    } catch (err) {
      showToast("Error updating step", "error");
    }
  };

  const handleInitializeNewPlan = () => {
    setEditingPlan({
      title: '',
      description: '',
      category: '',
      goal: '',
      durationInDays: '',
      startDateTime: '',
      steps: [], // Initialize with empty steps array
      userId: user?.id // Include user ID for new plans
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        📚 Learning Plans
      </Typography>

      <Button 
        variant="contained" 
        color="primary"
        fullWidth
        sx={{ mb: 4 }}
        onClick={handleInitializeNewPlan} // Use the new initialization function
      >
        ➕ Create New Learning Plan
      </Button>

      {/* Show form only when editing or creating */}
      {editingPlan && (
        <LearningPlanForm
          onSubmit={handleSubmit}
          editingPlan={editingPlan}
          onCancel={handleCancelEdit}
          resetTrigger={formResetTrigger}
        />
      )}

      <Typography variant="h5" mt={4} mb={2}>
        All Learning Plans
      </Typography>

      {plans.length === 0 ? (
        <Typography>No learning plans available.</Typography>
      ) : (
        <Stack spacing={3}>
          {plans.map((plan, index) => (
            <Card key={index} variant="outlined" sx={{ boxShadow: 2 }}>
              <CardContent>
                {/* Add user indicator */}
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  {plan.userId === user?.id ? "📌 Your Plan" : "👤 Other User's Plan"}
                </Typography>
                
                <Typography variant="h6">{plan.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {plan.description}
                </Typography>

                {/* ✨ NEW: show additional fields */}
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
                    📅 Start Date:{" "}
                    {new Date(plan.startDateTime).toLocaleString()}
                  </Typography>
                )}

                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Steps:
                </Typography>
                <List dense>
                  {plan.steps.map((s, i) => (
                    <ListItem
                      key={i}
                      onClick={() => handleToggleStep(plan.id, i)}
                      sx={{
                        cursor: "pointer",
                        userSelect: "none",
                        textDecoration: s.completed ? "line-through" : "none",
                        color: s.completed ? "gray" : "inherit",
                      }}
                    >
                      {s.step} {s.completed ? "✅" : "❌"}
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <CardActions sx={{ justifyContent: "flex-end", px: 2 }}>
                {/* Only show edit/delete buttons for user's own plans */}
                {plan.userId === user?.id && (
                  <>
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
                  </>
                )}
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.severity} onClose={closeToast} variant="filled">
          {toast.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LearningPlanPage;
