package com.skillchef.skillchef_backend.service.tashini;



import com.skillchef.skillchef_backend.model.tashini.ProgressUpdate;
import java.util.List;

public interface ProgressUpdateService {
    ProgressUpdate createUpdate(ProgressUpdate update);
    List<ProgressUpdate> getAllUpdates();
    ProgressUpdate updateProgress(String id, ProgressUpdate update);
    void deleteProgress(String id);
    ProgressUpdate getProgressById(String id);
}
