package com.skillchef.skillchef_backend.repository.Oshan;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillchef.skillchef_backend.model.Oshan.ProgressUpdate;

@Repository
public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
}
