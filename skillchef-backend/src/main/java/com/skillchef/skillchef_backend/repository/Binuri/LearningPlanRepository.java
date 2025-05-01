package com.skillchef.skillchef_backend.repository.Binuri;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillchef.skillchef_backend.model.Binuri.LearningPlan;

import java.util.List;

@Repository
public interface LearningPlanRepository extends MongoRepository<LearningPlan, String> {
    List<LearningPlan> findByUserId(String userId);
}