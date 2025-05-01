package com.skillchef.skillchef_backend.service.Binuri;

import java.util.List;
import java.util.Optional;

import com.skillchef.skillchef_backend.model.Binuri.LearningPlan;

public interface LearningPlanService {
    LearningPlan createPlan(LearningPlan plan);
    List<LearningPlan> getAllPlans();
    Optional<LearningPlan> getPlanById(String id);
    LearningPlan updatePlan(String id, LearningPlan updatedPlan);
    void deletePlan(String id);
}
