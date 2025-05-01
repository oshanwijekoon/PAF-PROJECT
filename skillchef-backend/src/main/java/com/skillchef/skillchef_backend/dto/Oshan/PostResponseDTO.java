package com.skillchef.skillchef_backend.dto.Oshan;

import java.util.List;
import java.util.Map;

public class PostResponseDTO {

    private String id;
    private String title;
    private String description;
    private List<String> mediaUrls;
    private List<String> hashtags;
    private String category;
    private String difficulty;
    private String userId;
    private String createdAt;

    // ✅ For HATEOAS links
    private Map<String, String> _links;

    // ✅ Constructors
    public PostResponseDTO() {
    }

    public PostResponseDTO(String id, String title, String description, List<String> mediaUrls, List<String> hashtags,
                           String category, String difficulty, String userId, String createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.mediaUrls = mediaUrls;
        this.hashtags = hashtags;
        this.category = category;
        this.difficulty = difficulty;
        this.userId = userId;
        this.createdAt = createdAt;
    }

    // ✅ Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public List<String> getHashtags() { return hashtags; }
    public void setHashtags(List<String> hashtags) { this.hashtags = hashtags; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Map<String, String> get_links() { return _links; }
    public void set_links(Map<String, String> _links) { this._links = _links; }
}
