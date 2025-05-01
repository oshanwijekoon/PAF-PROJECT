package com.skillchef.skillchef_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing  // ✅ Add this line
public class SkillchefBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SkillchefBackendApplication.class, args);
	}

}
