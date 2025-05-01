package com.skillchef.skillchef_backend.dto.nishitha;

import java.time.LocalDateTime;
import java.util.List;

public class LearningPlanDTO {

    private String title;
    private String description;
    private String userId;              // ✅ New
    private String category;            // ✅ New
    private Integer durationInDays;     // ✅ New
    private String goal;                // ✅ New
    private LocalDateTime startDateTime; // ✅ New

    private List<StepDTO> steps;

    public static class StepDTO {
        private String step;
        private boolean completed;

        public StepDTO() {}

        public StepDTO(String step, boolean completed) {
            this.step = step;
            this.completed = completed;
        }

        public String getStep() {
            return step;
        }

        public void setStep(String step) {
            this.step = step;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }

    public LearningPlanDTO() {}

    public LearningPlanDTO(String title, String description, String userId, String category,
                           Integer durationInDays, String goal, LocalDateTime startDateTime,
                           List<StepDTO> steps) {
        this.title = title;
        this.description = description;
        this.userId = userId;
        this.category = category;
        this.durationInDays = durationInDays;
        this.goal = goal;
        this.startDateTime = startDateTime;
        this.steps = steps;
    }

    // --- Getters & Setters for all fields ---

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getDurationInDays() {
        return durationInDays;
    }

    public void setDurationInDays(Integer durationInDays) {
        this.durationInDays = durationInDays;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public LocalDateTime getStartDateTime() {
        return startDateTime;
    }

    public void setStartDateTime(LocalDateTime startDateTime) {
        this.startDateTime = startDateTime;
    }

    public List<StepDTO> getSteps() {
        return steps;
    }

    public void setSteps(List<StepDTO> steps) {
        this.steps = steps;
    }
}
