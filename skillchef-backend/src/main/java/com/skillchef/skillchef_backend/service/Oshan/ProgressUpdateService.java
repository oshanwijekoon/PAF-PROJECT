package com.skillchef.skillchef_backend.service.Oshan;



import java.util.List;

import com.skillchef.skillchef_backend.model.Oshan.ProgressUpdate;

public interface ProgressUpdateService {
    ProgressUpdate createUpdate(ProgressUpdate update);
    List<ProgressUpdate> getAllUpdates();
    ProgressUpdate updateProgress(String id, ProgressUpdate update);
    void deleteProgress(String id);
    ProgressUpdate getProgressById(String id);
}
