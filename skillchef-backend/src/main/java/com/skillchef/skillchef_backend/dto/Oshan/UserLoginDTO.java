package com.skillchef.skillchef_backend.dto.Oshan;

public class UserLoginDTO {

    private String email;
    private String password;

    public UserLoginDTO() {}

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    // Optional setters
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
}
