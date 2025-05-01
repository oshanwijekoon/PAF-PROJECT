import React, { useEffect, useState, useContext } from "react";
import {
  getAllPlans,
  createPlan,
  deletePlan,
  updatePlan,
} from "../services/learningPlanService";
import LearningPlanForm from "../components/nishitha/LearningPlanForm";
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

      // ✅ Only show plans that belong to this user
      const userPlans = data.filter((plan) => plan.userId === user?.id);

      setPlans(userPlans);
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
      await createPlan(planData);
      loadPlans();
      setFormResetTrigger((prev) => prev + 1);
      showToast("Plan created successfully!");
    } catch (err) {
      showToast("Failed to create plan", "error");
    }
  };

  const handleUpdate = async (planData) => {
    try {
      await updatePlan(editingPlan.id, planData);
      setEditingPlan(null);
      loadPlans();
      setFormResetTrigger((prev) => prev + 1);
      showToast("Plan updated successfully!");
    } catch (err) {
      showToast("Failed to update plan", "error");
    }
  };

  const handleSubmit = (planData) => {
    if (editingPlan) {
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

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        📚 My Learning Plans
      </Typography>

      <LearningPlanForm
        onSubmit={handleSubmit}
        editingPlan={editingPlan}
        onCancel={handleCancelEdit}
        resetTrigger={formResetTrigger}
      />

      <Typography variant="h5" mt={4} mb={2}>
        All My Plans
      </Typography>

      {plans.length === 0 ? (
        <Typography>No learning plans yet.</Typography>
      ) : (
        <Stack spacing={3}>
          {plans.map((plan, index) => (
            <Card key={index} variant="outlined" sx={{ boxShadow: 2 }}>
              <CardContent>
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
