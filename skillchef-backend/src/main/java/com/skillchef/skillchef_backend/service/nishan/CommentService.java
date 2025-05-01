package com.skillchef.skillchef_backend.service.nishan;



import com.skillchef.skillchef_backend.model.nishan.Comment;

import java.util.List;

public interface CommentService {
    Comment createComment(Comment comment);
    List<Comment> getCommentsByPostId(String postId);
    Comment updateComment(String id, String newText);
    void deleteComment(String id);
}
