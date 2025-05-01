package com.skillchef.skillchef_backend.service.hashan;

import com.skillchef.skillchef_backend.dto.hashan.PostRequestDTO;
import com.skillchef.skillchef_backend.dto.hashan.PostResponseDTO;
import com.skillchef.skillchef_backend.model.hashan.Post;

import java.util.List;
import java.util.Optional;

public interface PostService {

    // Create a new post using DTO
    PostResponseDTO createPost(PostRequestDTO postRequestDTO);

    // Get all posts as a list of DTOs
    List<PostResponseDTO> getAllPosts();

    // Get single post by ID
    PostResponseDTO getPostById(String id);

    // Update a post using DTO
    PostResponseDTO updatePost(String id, PostRequestDTO postRequestDTO);

    // Delete a post by ID
    void deletePost(String id);

    // Save or update a raw Post object (used in createPostWithFiles and updatePostWithFiles)
    void savePost(Post post);

    // Find raw Post entity (used for file/image operations)
    Optional<Post> findPostByIdRaw(String id);

    // Get all posts by a specific user
    List<PostResponseDTO> getPostsByUserId(String userId);
}
