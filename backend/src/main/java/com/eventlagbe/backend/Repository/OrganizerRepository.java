package com.eventlagbe.backend.Repository;

import com.eventlagbe.backend.Models.Organizer;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrganizerRepository extends MongoRepository<Organizer, String> {
    Organizer findByUsername(String username);
    Organizer findByEmail(String email);
    Organizer findByFirebaseUid(String firebaseUid);
} 