package com.skillchef.skillchef_backend.model.Binuri;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "learningPlans")
public class LearningPlan {

    @Id
    private String id;
    private String title;
    private String description;
    private String userId;

    private String category;           // ✅ New
    private Integer durationInDays;    // ✅ New
    private String goal;               // ✅ New
    private LocalDateTime startDateTime; // ✅ New

    private List<Step> steps;

    public static class Step {
        private String step;
        private boolean completed;

        public Step() {}

        public Step(String step, boolean completed) {
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

    public LearningPlan() {}

    // --- Getters and Setters ---

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }
}
