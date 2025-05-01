package com.skillchef.skillchef_backend.repository.Oshan;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillchef.skillchef_backend.model.Oshan.Post;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    // ✅ Custom query to find posts by userId
    List<Post> findByUserId(String userId);

    // Other filtering queries
    List<Post> findByCategory(String category);

    List<Post> findByDifficulty(String difficulty);

    List<Post> findByHashtagsIn(List<String> hashtags);
}
