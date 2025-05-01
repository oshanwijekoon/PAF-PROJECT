package com.skillchef.skillchef_backend.repository.Senura;



import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.skillchef.skillchef_backend.model.Senura.Comment;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
