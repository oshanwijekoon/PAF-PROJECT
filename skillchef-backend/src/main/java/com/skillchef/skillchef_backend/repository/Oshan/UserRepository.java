package com.skillchef.skillchef_backend.repository.Oshan;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.skillchef.skillchef_backend.model.Oshan.User;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
}
