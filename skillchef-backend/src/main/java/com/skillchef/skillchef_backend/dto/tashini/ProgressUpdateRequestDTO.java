package com.skillchef.skillchef_backend.dto.tashini;



import lombok.Data;

import java.time.LocalDate;

@Data
public class ProgressUpdateRequestDTO {
    private String planId;
    private String updateText;
    private String templateType;
    private int rating;
    private LocalDate date;
    private String difficultyLevel;
    private String nextStep;
    private boolean completed;
     private String userId; // ✅ Add this field!
}
