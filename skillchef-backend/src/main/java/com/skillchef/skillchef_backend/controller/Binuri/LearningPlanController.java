package com.skillchef.skillchef_backend.controller.Binuri;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillchef.skillchef_backend.dto.Binuri.LearningPlanDTO;
import com.skillchef.skillchef_backend.model.Binuri.LearningPlan;
import com.skillchef.skillchef_backend.service.Binuri.LearningPlanService;

@RestController
@RequestMapping("/api/plans")
@CrossOrigin
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    // 🔵 Create a plan
    @PostMapping
    public EntityModel<LearningPlan> createPlan(@RequestBody LearningPlanDTO dto) {
        LearningPlan plan = mapDtoToEntity(dto);
        LearningPlan created = learningPlanService.createPlan(plan);
        return toModel(created);
    }

    // 🔵 Get all plans
    @GetMapping
    public CollectionModel<EntityModel<LearningPlan>> getAllPlans() {
        List<EntityModel<LearningPlan>> plans = learningPlanService.getAllPlans().stream()
                .map(this::toModel)
                .collect(Collectors.toList());

        return CollectionModel.of(plans,
                linkTo(methodOn(LearningPlanController.class).getAllPlans()).withSelfRel());
    }

    // 🔵 Get a specific plan
    @GetMapping("/{id}")
    public EntityModel<LearningPlan> getPlan(@PathVariable String id) {
        LearningPlan plan = learningPlanService.getPlanById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        return toModel(plan);
    }

    // 🔵 Update a learing plan
    @PutMapping("/{id}")
    public EntityModel<LearningPlan> updatePlan(@PathVariable String id, @RequestBody LearningPlanDTO dto) {
        LearningPlan updatedPlan = mapDtoToEntity(dto);
        LearningPlan updated = learningPlanService.updatePlan(id, updatedPlan);
        return toModel(updated);
    }

    // 🔵 Delete a learning plan
    @DeleteMapping("/{id}")
    public EntityModel<Map<String, String>> deletePlan(@PathVariable String id) {
        learningPlanService.deletePlan(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Plan deleted");

        return EntityModel.of(response,
                linkTo(methodOn(LearningPlanController.class).getAllPlans()).withRel("all-plans"),
                linkTo(methodOn(LearningPlanController.class).createPlan(null)).withRel("create").withType("POST")
        );
    }

    // === 🔵 Helper: Convert DTO to Entity ===
    private LearningPlan mapDtoToEntity(LearningPlanDTO dto) {
        LearningPlan plan = new LearningPlan();
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());
        plan.setUserId(dto.getUserId());
        plan.setCategory(dto.getCategory());
        plan.setDurationInDays(dto.getDurationInDays());
        plan.setGoal(dto.getGoal());
        plan.setStartDateTime(dto.getStartDateTime());

        if (dto.getSteps() != null) {
            plan.setSteps(
                    dto.getSteps().stream()
                            .map(s -> new LearningPlan.Step(s.getStep(), s.isCompleted()))
                            .collect(Collectors.toList())
            );
        }
        return plan;
    }

    // === 🔵 Helper: Convert Entity to HATEOAS model ===
    private EntityModel<LearningPlan> toModel(LearningPlan plan) {
        return EntityModel.of(plan,
                linkTo(methodOn(LearningPlanController.class).getPlan(plan.getId())).withSelfRel(),
                linkTo(methodOn(LearningPlanController.class).updatePlan(plan.getId(), null)).withRel("update").withType("PUT"),
                linkTo(methodOn(LearningPlanController.class).deletePlan(plan.getId())).withRel("delete").withType("DELETE"),
                linkTo(methodOn(LearningPlanController.class).getAllPlans()).withRel("all-plans"));
    }
}
