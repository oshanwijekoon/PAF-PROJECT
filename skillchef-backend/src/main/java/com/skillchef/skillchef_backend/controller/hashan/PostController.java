package com.skillchef.skillchef_backend.controller.hashan;

import com.skillchef.skillchef_backend.dto.hashan.PostRequestDTO;
import com.skillchef.skillchef_backend.dto.hashan.PostResponseDTO;
import com.skillchef.skillchef_backend.model.hashan.Post;
import com.skillchef.skillchef_backend.service.hashan.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
//import org.springframework.hateoas.Link;
//import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<String> createPostWithFiles(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("difficulty") String difficulty,
            @RequestParam("userId") String userId,
            @RequestParam("hashtags") String hashtags,
            @RequestParam("files") List<MultipartFile> files
    ) {
        try {
            List<String> imagePaths = new ArrayList<>();
            String uploadDir = System.getProperty("user.dir") + "/skillchef-backend/uploads/";

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String safeFileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
                    Path filePath = Paths.get(uploadDir + safeFileName);
                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, file.getBytes());
                    imagePaths.add("/uploads/" + safeFileName);
                }
            }

            List<String> hashtagList = Arrays.stream(hashtags.split(","))
                    .map(String::trim)
                    .filter(tag -> !tag.isEmpty())
                    .toList();

            Post post = new Post();
            post.setTitle(title);
            post.setDescription(description);
            post.setCategory(category);
            post.setDifficulty(difficulty);
            post.setUserId(userId);
            post.setHashtags(hashtagList);
            post.setMediaUrls(imagePaths);
            post.setCreatedAt(LocalDateTime.now().toString());

            postService.savePost(post);

            return ResponseEntity.ok("Post created successfully with uploaded images.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("File upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public EntityModel<PostResponseDTO> updatePost(@PathVariable String id, @RequestBody PostRequestDTO dto) {
        PostResponseDTO updatedPost = postService.updatePost(id, dto);

        return EntityModel.of(updatedPost,
                linkTo(methodOn(PostController.class).getPostById(id)).withSelfRel(),
                linkTo(methodOn(PostController.class).deletePost(id)).withRel("delete"),
                linkTo(methodOn(PostController.class).getAllPosts()).withRel("all-posts")
        );
    }

    @PutMapping(value = "/{id}/with-images", consumes = "multipart/form-data")
    public ResponseEntity<String> updatePostWithFiles(
            @PathVariable String id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("difficulty") String difficulty,
            @RequestParam("userId") String userId,
            @RequestParam("hashtags") String hashtags,
            @RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {
        try {
            Optional<Post> optionalPost = postService.findPostByIdRaw(id);
            if (optionalPost.isEmpty()) return ResponseEntity.notFound().build();

            Post post = optionalPost.get();

            if (files != null && !files.isEmpty()) {
                List<String> newImagePaths = new ArrayList<>();
                String uploadDir = System.getProperty("user.dir") + "/skillchef-backend/uploads/";

                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String safeFileName = UUID.randomUUID() + "_" + file.getOriginalFilename().replaceAll(" ", "_");
                        Path filePath = Paths.get(uploadDir + safeFileName);
                        Files.createDirectories(filePath.getParent());
                        Files.write(filePath, file.getBytes());
                        newImagePaths.add("/uploads/" + safeFileName);
                    }
                }
                post.setMediaUrls(newImagePaths);
            }

            post.setTitle(title);
            post.setDescription(description);
            post.setCategory(category);
            post.setDifficulty(difficulty);
            post.setUserId(userId);
            post.setHashtags(Arrays.stream(hashtags.split(",")).map(String::trim).toList());

            postService.savePost(post);
            return ResponseEntity.ok("Post updated with new images!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Update failed: " + e.getMessage());
        }
    }

    @GetMapping
    public List<EntityModel<PostResponseDTO>> getAllPosts() {
        List<PostResponseDTO> posts = postService.getAllPosts();
        List<EntityModel<PostResponseDTO>> result = new ArrayList<>();

        for (PostResponseDTO post : posts) {
            EntityModel<PostResponseDTO> model = EntityModel.of(post,
                    linkTo(methodOn(PostController.class).getPostById(post.getId())).withSelfRel(),
                    linkTo(methodOn(PostController.class).deletePost(post.getId())).withRel("delete"),
                    linkTo(methodOn(PostController.class).getAllPosts()).withRel("all-posts")
            );
            result.add(model);
        }

        return result;
    }

    @GetMapping("/{id}")
    public EntityModel<PostResponseDTO> getPostById(@PathVariable String id) {
        PostResponseDTO post = postService.getPostById(id);
        return EntityModel.of(post,
                linkTo(methodOn(PostController.class).getPostById(id)).withSelfRel(),
                linkTo(methodOn(PostController.class).getAllPosts()).withRel("all-posts"),
                linkTo(methodOn(PostController.class).deletePost(id)).withRel("delete")
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.ok("Deleted");
    }

    @GetMapping("/user/{userId}")
    public List<PostResponseDTO> getPostsByUserId(@PathVariable String userId) {
        return postService.getPostsByUserId(userId);
    }
}
