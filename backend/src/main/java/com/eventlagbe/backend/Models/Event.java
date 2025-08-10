package com.eventlagbe.backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "events")
public class Event {
    @Id
    private String id;

    @Indexed
    private String title;

    private String description;
    private String location;
    private String eventType; // on-site | online
    private String organizationId; // creator org id

    private List<String> requiredSkillIds = new ArrayList<>();
    private List<String> sponsorNames = new ArrayList<>();
    private String coverImageUrl;
    private List<String> tags = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getOrganizationId() { return organizationId; }
    public void setOrganizationId(String organizationId) { this.organizationId = organizationId; }
    public List<String> getRequiredSkillIds() { return requiredSkillIds; }
    public void setRequiredSkillIds(List<String> requiredSkillIds) { this.requiredSkillIds = requiredSkillIds; }
    public List<String> getSponsorNames() { return sponsorNames; }
    public void setSponsorNames(List<String> sponsorNames) { this.sponsorNames = sponsorNames; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


