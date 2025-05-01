import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext"; // ✅ Import AuthContext
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import dayjs from "dayjs";

const templateOptions = [
  "New Skill Learned",
  "Completed Recipe",
  "Struggled With",
  "Tried Something New",
];

const difficultyOptions = ["Easy", "Medium", "Hard"];

const ProgressForm = ({ onSubmit, editingData, onCancel }) => {
  const { user } = useContext(AuthContext); // ✅ get logged-in user

  const [form, setForm] = useState({
    planId: "",
    updateText: "",
    templateType: "",
    rating: "",
    date: dayjs().format("YYYY-MM-DD"),
    difficultyLevel: "",
    nextStep: "",
    completed: false,
  });

  useEffect(() => {
    if (editingData) {
      setForm({ ...editingData });
    } else {
      resetForm();
    }
  }, [editingData]);

  const resetForm = () => {
    setForm({
      planId: "",
      updateText: "",
      templateType: "",
      rating: "",
      date: dayjs().format("YYYY-MM-DD"),
      difficultyLevel: "",
      nextStep: "",
      completed: false,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      ...form,
      userId: user?.id, // ✅ automatically attach userId
    };

    onSubmit(formData);

    if (!editingData) resetForm(); // clear after create
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: "auto", mb: 4 }}>
      <Typography variant="h6" mb={2}>
        {editingData ? "✏️ Edit Progress" : "➕ New Progress Update"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Learning Plan ID"
            name="planId"
            value={form.planId}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Progress Description"
            name="updateText"
            value={form.updateText}
            onChange={handleChange}
            multiline
            rows={3}
            required
            fullWidth
          />
          <TextField
            label="Template Type"
            name="templateType"
            select
            value={form.templateType}
            onChange={handleChange}
            required
            fullWidth
          >
            {templateOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Rating (1-5)"
            name="rating"
            type="number"
            value={form.rating}
            onChange={handleChange}
            required
            inputProps={{ min: 1, max: 5 }}
            fullWidth
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Difficulty Level"
            name="difficultyLevel"
            select
            value={form.difficultyLevel}
            onChange={handleChange}
            fullWidth
          >
            {difficultyOptions.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Next Step"
            name="nextStep"
            value={form.nextStep}
            onChange={handleChange}
            fullWidth
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {editingData && (
              <Button onClick={onCancel} color="warning">
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained" color="primary">
              {editingData ? "Update" : "Create"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ProgressForm;
