package com.skillchef.skillchef_backend.service.Senura;


import com.skillchef.skillchef_backend.model.Senura.Comment;
import com.skillchef.skillchef_backend.repository.Senura.CommentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    @Override
    public List<Comment> getCommentsByPostId(String postId) {
        return commentRepository.findByPostId(postId);
    }

    @Override
    public Comment updateComment(String id, String newText) {
        return commentRepository.findById(id)
                .map(existing -> {
                    existing.setText(newText);
                    existing.setUpdatedAt(LocalDateTime.now());
                    return commentRepository.save(existing);
                }).orElse(null);
    }

    @Override
    public void deleteComment(String id) {
        commentRepository.deleteById(id);
    }
}
