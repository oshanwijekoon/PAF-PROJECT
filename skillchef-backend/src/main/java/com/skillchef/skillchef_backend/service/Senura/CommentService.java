package com.skillchef.skillchef_backend.service.Senura;



import java.util.List;

import com.skillchef.skillchef_backend.model.Senura.Comment;

public interface CommentService {
    Comment createComment(Comment comment);
    List<Comment> getCommentsByPostId(String postId);
    Comment updateComment(String id, String newText);
    void deleteComment(String id);
}
