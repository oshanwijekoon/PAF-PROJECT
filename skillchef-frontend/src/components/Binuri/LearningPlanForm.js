import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import dayjs from "dayjs"; // 🕒 For date formatting

const LearningPlanForm = ({
  onSubmit,
  editingPlan,
  onCancel,
  resetTrigger,
}) => {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    goal: "",
    durationInDays: "",
    startDateTime: dayjs().format("YYYY-MM-DDTHH:mm"), // 🕒 Default to now
    steps: [{ step: "", completed: false }],
  });

  useEffect(() => {
    if (editingPlan) {
      setForm({
        ...editingPlan,
        startDateTime:
          editingPlan.startDateTime || dayjs().format("YYYY-MM-DDTHH:mm"),
      });
    }
  }, [editingPlan]);

  useEffect(() => {
    if (!editingPlan) {
      setForm({
        title: "",
        description: "",
        category: "",
        goal: "",
        durationInDays: "",
        startDateTime: dayjs().format("YYYY-MM-DDTHH:mm"),
        steps: [{ step: "", completed: false }],
      });
    }
  }, [resetTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...form.steps];
    updatedSteps[index].step = value;
    setForm((prev) => ({
      ...prev,
      steps: updatedSteps,
    }));
  };

  const addStepField = () => {
    setForm((prev) => ({
      ...prev,
      steps: [...prev.steps, { step: "", completed: false }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const planData = {
      ...form,
      userId: user?.id, // ✅ Auto attach userId
    };
    onSubmit(planData);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        p: 4,
        mb: 4,
        maxWidth: 600,
        mx: "auto",
        backgroundColor: "#fdfdfd",
        borderRadius: 3,
      }}
    >
      <Typography variant="h5" mb={3} fontWeight={600}>
        {editingPlan ? "Learning Plan" : "Learning Plan"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
          />
          <TextField
            label="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Goal"
            name="goal"
            value={form.goal}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Duration (Days)"
            name="durationInDays"
            type="number"
            value={form.durationInDays}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Start Date and Time"
            name="startDateTime"
            type="datetime-local"
            value={form.startDateTime}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />

          <Typography variant="subtitle1" fontWeight={500}>
            Steps
          </Typography>

          {form.steps.map((s, index) => (
            <TextField
              key={index}
              label={`Step ${index + 1}`}
              value={s.step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              fullWidth
              required
            />
          ))}

          <Button
            type="button"
            onClick={addStepField}
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ alignSelf: "flex-start" }}
          >
            Add Step
          </Button>

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {editingPlan && (
              <Button
                type="button"
                onClick={onCancel}
                startIcon={<CancelIcon />}
                variant="outlined"
                color="warning"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
            >
              {editingPlan ? "Save" : "Save"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default LearningPlanForm;


