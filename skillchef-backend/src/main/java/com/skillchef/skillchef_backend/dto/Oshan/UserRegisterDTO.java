package com.skillchef.skillchef_backend.dto.Oshan;

public class UserRegisterDTO {

    private String username;
    private String email;
    private String password;
    private String bio;
    private String profilePic;
    private String location;

    public UserRegisterDTO() {}

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getBio() {
        return bio;
    }

    public String getProfilePic() {
        return profilePic;
    }

    public String getLocation() {
        return location;
    }

    // Optional: Setters if needed
    public void setUsername(String username) { this.username = username; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setBio(String bio) { this.bio = bio; }
    public void setProfilePic(String profilePic) { this.profilePic = profilePic; }
    public void setLocation(String location) { this.location = location; }
}
