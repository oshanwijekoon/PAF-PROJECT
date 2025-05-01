package com.skillchef.skillchef_backend.dto.hashan;

import lombok.Data;

import java.util.List;

@Data
public class PostRequestDTO {
    private String title;
    private String description;
    private List<String> mediaUrls;   // URLs for up to 3 media files
    private List<String> hashtags;
    private String category;
    private String difficulty;
    private String userId;            // Optional if you plan to get from auth token
}
