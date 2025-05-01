package com.skillchef.skillchef_backend.service.nishitha;

import com.skillchef.skillchef_backend.model.nishitha.LearningPlan;

import java.util.List;
import java.util.Optional;

public interface LearningPlanService {
    LearningPlan createPlan(LearningPlan plan);
    List<LearningPlan> getAllPlans();
    Optional<LearningPlan> getPlanById(String id);
    LearningPlan updatePlan(String id, LearningPlan updatedPlan);
    void deletePlan(String id);
}
