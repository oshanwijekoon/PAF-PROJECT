package com.skillchef.skillchef_backend.service.Oshan;



import com.skillchef.skillchef_backend.model.Oshan.ProgressUpdate;
import com.skillchef.skillchef_backend.repository.Oshan.ProgressUpdateRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressUpdateServiceImpl implements ProgressUpdateService {

    @Autowired
    private ProgressUpdateRepository repository;

    @Override
    public ProgressUpdate createUpdate(ProgressUpdate update) {
        return repository.save(update);
    }

    @Override
    public List<ProgressUpdate> getAllUpdates() {
        return repository.findAll();
    }

    @Override
    public ProgressUpdate updateProgress(String id, ProgressUpdate updated) {
        return repository.findById(id).map(existing -> {
            existing.setUpdateText(updated.getUpdateText());
            existing.setTemplateType(updated.getTemplateType());
            existing.setRating(updated.getRating());
            existing.setDate(updated.getDate());
            existing.setDifficultyLevel(updated.getDifficultyLevel());
            existing.setNextStep(updated.getNextStep());
            existing.setCompleted(updated.isCompleted());
            return repository.save(existing);
        }).orElse(null);
    }

    @Override
    public void deleteProgress(String id) {
        repository.deleteById(id);
    }

    @Override
    public ProgressUpdate getProgressById(String id) {
        return repository.findById(id).orElse(null);
    }
}
