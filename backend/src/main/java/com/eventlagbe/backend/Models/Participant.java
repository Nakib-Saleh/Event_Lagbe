package com.eventlagbe.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "participants")
public class Participant {
    @Id
    private String id;
    @Indexed(unique = true)
    private String email;
    @Indexed(unique = true)
    private String name;
    private String username;
    private String passwordHash;
    private String institution;
    private List<String> idDocumentUrls;
    private boolean verifiedByAdmin = false;
    private List<String> interestedSkills;
    private List<String> registeredEventIds;
    private List<String> pastEventIds;
    private List<String> favoriteOrganizerIds;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private String firebaseUid;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public List<String> getIdDocumentUrls() { return idDocumentUrls; }
    public void setIdDocumentUrls(List<String> idDocumentUrls) { this.idDocumentUrls = idDocumentUrls; }

    public boolean isVerifiedByAdmin() { return verifiedByAdmin; }
    public void setVerifiedByAdmin(boolean verifiedByAdmin) { this.verifiedByAdmin = verifiedByAdmin; }

    public List<String> getInterestedSkills() { return interestedSkills; }
    public void setInterestedSkills(List<String> interestedSkills) { this.interestedSkills = interestedSkills; }

    public List<String> getRegisteredEventIds() { return registeredEventIds; }
    public void setRegisteredEventIds(List<String> registeredEventIds) { this.registeredEventIds = registeredEventIds; }

    public List<String> getPastEventIds() { return pastEventIds; }
    public void setPastEventIds(List<String> pastEventIds) { this.pastEventIds = pastEventIds; }

    public List<String> getFavoriteOrganizerIds() { return favoriteOrganizerIds; }
    public void setFavoriteOrganizerIds(List<String> favoriteOrganizerIds) { this.favoriteOrganizerIds = favoriteOrganizerIds; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getFirebaseUid() { return firebaseUid; }
    public void setFirebaseUid(String firebaseUid) { this.firebaseUid = firebaseUid; }
}
