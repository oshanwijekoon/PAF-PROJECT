package com.skillchef.skillchef_backend.model.tashini;



import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document("progress_updates") // MongoDB collection name
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProgressUpdate {

    @Id
    private String id;

    private String userId;
    private String planId;
    private String updateText;
    private String templateType; // e.g., "New Skill Learned"
    private int rating; // optional 1-5
    private LocalDate date; // e.g., 2025-04-25
    private String difficultyLevel; // "Easy", "Medium", "Hard"
    private String nextStep;
    private boolean completed;
}
