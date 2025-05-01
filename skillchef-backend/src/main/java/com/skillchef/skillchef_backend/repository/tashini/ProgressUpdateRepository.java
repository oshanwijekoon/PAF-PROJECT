package com.skillchef.skillchef_backend.repository.tashini;



import com.skillchef.skillchef_backend.model.tashini.ProgressUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressUpdateRepository extends MongoRepository<ProgressUpdate, String> {
}
