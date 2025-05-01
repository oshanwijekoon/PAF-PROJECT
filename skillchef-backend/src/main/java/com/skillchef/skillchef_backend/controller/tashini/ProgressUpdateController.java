package com.skillchef.skillchef_backend.controller.tashini;

import com.skillchef.skillchef_backend.dto.tashini.ProgressUpdateRequestDTO;
import com.skillchef.skillchef_backend.model.tashini.ProgressUpdate;
import com.skillchef.skillchef_backend.service.tashini.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService service;

   @PostMapping
public EntityModel<ProgressUpdate> create(@RequestBody ProgressUpdateRequestDTO dto) {
    ProgressUpdate update = mapDtoToEntity(dto);
    update.setUserId(dto.getUserId()); // ✅ use the userId from DTO
    ProgressUpdate saved = service.createUpdate(update);
    return toModel(saved);
}


    @GetMapping
    public List<EntityModel<ProgressUpdate>> getAll() {
        return service.getAllUpdates().stream()
                .map(this::toModel)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public EntityModel<ProgressUpdate> getById(@PathVariable String id) {
        ProgressUpdate found = service.getProgressById(id);
        return toModel(found);
    }

    @PutMapping("/{id}")
    public EntityModel<ProgressUpdate> update(@PathVariable String id, @RequestBody ProgressUpdateRequestDTO dto) {
        ProgressUpdate update = mapDtoToEntity(dto);
        ProgressUpdate updated = service.updateProgress(id, update);
        return toModel(updated);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteProgress(id);
    }

    // HATEOAS Links
    private EntityModel<ProgressUpdate> toModel(ProgressUpdate update) {
        return EntityModel.of(update,
                linkTo(methodOn(ProgressUpdateController.class).getById(update.getId())).withSelfRel(),
                linkTo(methodOn(ProgressUpdateController.class).getAll()).withRel("all-progress"),
                linkTo(methodOn(ProgressUpdateController.class).update(update.getId(), null)).withRel("update"),
                linkTo(ProgressUpdateController.class).slash(update.getId()).withRel("delete")
        );
    }

    // Map ProgressUpdateRequestDTO → ProgressUpdate Entity
    private ProgressUpdate mapDtoToEntity(ProgressUpdateRequestDTO dto) {
        ProgressUpdate update = new ProgressUpdate();
        update.setPlanId(dto.getPlanId());
        update.setUpdateText(dto.getUpdateText());
        update.setTemplateType(dto.getTemplateType());
        update.setRating(dto.getRating());
        update.setDate(dto.getDate());
        update.setDifficultyLevel(dto.getDifficultyLevel());
        update.setNextStep(dto.getNextStep());
        update.setCompleted(dto.isCompleted());
        return update;
    }
}
