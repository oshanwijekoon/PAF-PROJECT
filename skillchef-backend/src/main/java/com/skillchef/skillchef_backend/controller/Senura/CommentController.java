package com.skillchef.skillchef_backend.controller.Senura;



import com.skillchef.skillchef_backend.model.Senura.Comment;
import com.skillchef.skillchef_backend.service.Senura.CommentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping
    public EntityModel<Comment> createComment(@RequestBody Comment comment) {
        Comment saved = commentService.createComment(comment);
        return toModel(saved);
    }

    @GetMapping("/post/{postId}")
    public CollectionModel<EntityModel<Comment>> getCommentsByPost(@PathVariable String postId) {
        List<EntityModel<Comment>> comments = commentService.getCommentsByPostId(postId).stream()
                .map(this::toModel)
                .collect(Collectors.toList());
        return CollectionModel.of(comments,
                linkTo(methodOn(CommentController.class).getCommentsByPost(postId)).withSelfRel());
    }

 @PutMapping("/{id}")
public EntityModel<Comment> updateComment(@PathVariable String id, @RequestBody Map<String, String> body) {
    String newText = body.get("text"); // ✅ Extract the actual text value
    Comment updated = commentService.updateComment(id, newText);
    return toModel(updated);
}

  @DeleteMapping("/{id}")
public EntityModel<Map<String, String>> deleteComment(@PathVariable String id) {
    commentService.deleteComment(id);

    Map<String, String> response = new HashMap<>();
    response.put("message", "Comment deleted");

    return EntityModel.of(response,
            linkTo(methodOn(CommentController.class).getCommentsByPost("dummy")).withRel("all-comments"));
}

    // === HATEOAS helper ===
    private EntityModel<Comment> toModel(Comment comment) {
        return EntityModel.of(comment,
                linkTo(methodOn(CommentController.class).createComment(null)).withRel("create").withType("POST"),
                linkTo(methodOn(CommentController.class).updateComment(comment.getId(), null)).withRel("update").withType("PUT"),
                linkTo(methodOn(CommentController.class).deleteComment(comment.getId())).withRel("delete").withType("DELETE"),
                linkTo(methodOn(CommentController.class).getCommentsByPost(comment.getPostId())).withRel("post-comments")
        );
    }
}
