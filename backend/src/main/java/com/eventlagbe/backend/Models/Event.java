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
    private String ownerId; // creator org id
    private String coverImageUrl = "https://res.cloudinary.com/dfvwazcdk/image/upload/v1753513555/banner_z0sar4.png";
    private String bannerUrl = "https://res.cloudinary.com/dfvwazcdk/image/upload/v1753513555/banner_z0sar4.png";
    private String eventScope;
    private String venue;
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;
    private String organizerName; 

    private boolean isActive = true;

    private List<String> requiredSkills = new ArrayList<>();
    private List<String> coHosts = new ArrayList<>();
    private List<String> sponsors = new ArrayList<>();
    private List<String> bookmarkedBy = new ArrayList<>();
    private List<String> tags = new ArrayList<>();

    private int interestedCount = 0;
    private int goingCount = 0;
    private int sharesCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean getIsActive() { return isActive; }
    public void setIsActive(boolean isActive) { this.isActive = isActive; }

    public String getEventScope() { return eventScope; }
    public void setEventScope(String eventScope) { this.eventScope = eventScope; }


    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public String getOwnerId() { return ownerId; }
    public void setOwnerId(String ownerId) { this.ownerId = ownerId; }
    
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }

    public List<String> getCoHosts() { return coHosts; }
    public void setCoHosts(List<String> coHosts) { this.coHosts = coHosts; }

    public List<String> getSponsors() { return sponsors; }
    public void setSponsors(List<String> sponsors) { this.sponsors = sponsors; }

    public List<String> getBookmarkedBy() { return bookmarkedBy; }
    public void setBookmarkedBy(List<String> bookmarkedBy) { this.bookmarkedBy = bookmarkedBy; }

    public String getCoverImageUrl() { return coverImageUrl; }
    public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }

    public String getBannerUrl() { return bannerUrl; }
    public void setBannerUrl(String bannerUrl) { this.bannerUrl = bannerUrl; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }

    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public int getInterestedCount() { return interestedCount; }
    public void setInterestedCount(int interestedCount) { this.interestedCount = interestedCount; }

    public int getGoingCount() { return goingCount; }
    public void setGoingCount(int goingCount) { this.goingCount = goingCount; }

    public int getSharesCount() { return sharesCount; }
    public void setSharesCount(int sharesCount) { this.sharesCount = sharesCount; }
}


