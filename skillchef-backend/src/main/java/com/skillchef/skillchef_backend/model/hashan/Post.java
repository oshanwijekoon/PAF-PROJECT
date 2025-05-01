package com.skillchef.skillchef_backend.model.hashan;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Post {

    @Id
    private String id;

    private String title;
    private String description;
    private List<String> mediaUrls;      // ✅ store uploaded image paths
    private List<String> hashtags;
    private String category;
    private String difficulty;
    private String userId;
    private String createdAt;
}
