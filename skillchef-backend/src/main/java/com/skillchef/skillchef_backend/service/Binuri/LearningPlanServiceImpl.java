package com.skillchef.skillchef_backend.service.Binuri;

import com.skillchef.skillchef_backend.model.Binuri.LearningPlan;
import com.skillchef.skillchef_backend.repository.Binuri.LearningPlanRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Override
    public LearningPlan createPlan(LearningPlan plan) {
        return learningPlanRepository.save(plan);
    }

    @Override
    public List<LearningPlan> getAllPlans() {
        return learningPlanRepository.findAll();
    }

    @Override
    public Optional<LearningPlan> getPlanById(String id) {
        return learningPlanRepository.findById(id);
    }

    @Override
    public LearningPlan updatePlan(String id, LearningPlan updatedPlan) {
        return learningPlanRepository.findById(id).map(existingPlan -> {
            existingPlan.setTitle(updatedPlan.getTitle());
            existingPlan.setDescription(updatedPlan.getDescription());
            existingPlan.setCategory(updatedPlan.getCategory());
            existingPlan.setDurationInDays(updatedPlan.getDurationInDays());
            existingPlan.setGoal(updatedPlan.getGoal());
            existingPlan.setStartDateTime(updatedPlan.getStartDateTime());
            existingPlan.setSteps(updatedPlan.getSteps());
            return learningPlanRepository.save(existingPlan);
        }).orElse(null);
    }

    @Override
    public void deletePlan(String id) {
        learningPlanRepository.deleteById(id);
    }
}
