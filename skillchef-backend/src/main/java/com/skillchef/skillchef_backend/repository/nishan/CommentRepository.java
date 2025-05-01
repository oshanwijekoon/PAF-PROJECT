package com.skillchef.skillchef_backend.repository.nishan;



import com.skillchef.skillchef_backend.model.nishan.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
}
