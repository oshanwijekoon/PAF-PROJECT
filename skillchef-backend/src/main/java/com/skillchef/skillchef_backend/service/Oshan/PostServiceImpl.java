package com.skillchef.skillchef_backend.service.Oshan;

import com.skillchef.skillchef_backend.dto.Oshan.PostRequestDTO;
import com.skillchef.skillchef_backend.dto.Oshan.PostResponseDTO;
import com.skillchef.skillchef_backend.model.Oshan.Post;
import com.skillchef.skillchef_backend.repository.Oshan.PostRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Override
    public PostResponseDTO createPost(PostRequestDTO dto) {
        Post post = new Post(
                null,
                dto.getTitle(),
                dto.getDescription(),
                dto.getMediaUrls(),
                dto.getHashtags(),
                dto.getCategory(),
                dto.getDifficulty(),
                dto.getUserId(),
                LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME)
        );
        Post savedPost = postRepository.save(post);
        return mapToDTO(savedPost);
    }

    @Override
    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PostResponseDTO getPostById(String id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToDTO(post);
    }

    @Override
    public PostResponseDTO updatePost(String id, PostRequestDTO dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.setTitle(dto.getTitle());
        post.setDescription(dto.getDescription());
        post.setMediaUrls(dto.getMediaUrls());
        post.setHashtags(dto.getHashtags());
        post.setCategory(dto.getCategory());
        post.setDifficulty(dto.getDifficulty());

        return mapToDTO(postRepository.save(post));
    }

    @Override
    public void deletePost(String id) {
        postRepository.deleteById(id);
    }

    @Override
    public void savePost(Post post) {
        postRepository.save(post);
    }

    @Override
    public Optional<Post> findPostByIdRaw(String id) {
        return postRepository.findById(id);
    }

    @Override
    public List<PostResponseDTO> getPostsByUserId(String userId) {
        return postRepository.findByUserId(userId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // ✅ HATEOAS Helper
    private PostResponseDTO mapToDTO(Post post) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setDescription(post.getDescription());
        dto.setMediaUrls(post.getMediaUrls());
        dto.setHashtags(post.getHashtags());
        dto.setCategory(post.getCategory());
        dto.setDifficulty(post.getDifficulty());
        dto.setUserId(post.getUserId());
        dto.setCreatedAt(post.getCreatedAt());

        // ✅ Add HATEOAS links
        Map<String, String> links = new HashMap<>();
        links.put("self", "/api/posts/" + post.getId());
        links.put("update", "/api/posts/" + post.getId());
        links.put("delete", "/api/posts/" + post.getId());
        links.put("user", "/api/users/" + post.getUserId());

        dto.set_links(links);

        return dto;
    }
}
