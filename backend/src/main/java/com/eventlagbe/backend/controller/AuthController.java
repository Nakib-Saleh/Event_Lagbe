package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Admin;
import com.eventlagbe.backend.Models.Organization;
import com.eventlagbe.backend.Models.Organizer;
import com.eventlagbe.backend.Models.Participant;
import com.eventlagbe.backend.Repository.AdminRepository;
import com.eventlagbe.backend.Repository.OrganizationRepository;
import com.eventlagbe.backend.Repository.OrganizerRepository;
import com.eventlagbe.backend.Repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private OrganizerRepository organizerRepository;
    @Autowired
    private ParticipantRepository participantRepository;

    /* Register API */

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        if (admin.getFirebaseUid() == null || admin.getFirebaseUid().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing Firebase UID");
        }
        Admin saved = adminRepository.save(admin);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/register/organization")
    public ResponseEntity<?> registerOrganization(@RequestBody Organization org) {
        if (org.getFirebaseUid() == null || org.getFirebaseUid().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing Firebase UID");
        }
        Organization saved = organizationRepository.save(org);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/register/organizer")
    public ResponseEntity<?> registerOrganizer(@RequestBody Organizer organizer) {
        if (organizer.getFirebaseUid() == null || organizer.getFirebaseUid().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing Firebase UID");
        }
        Organizer saved = organizerRepository.save(organizer);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/register/participant")
    public ResponseEntity<?> registerParticipant(@RequestBody Participant participant) {
        if (participant.getFirebaseUid() == null || participant.getFirebaseUid().isEmpty()) {
            return ResponseEntity.badRequest().body("Missing Firebase UID");
        }
        Participant saved = participantRepository.save(participant);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/role/{firebaseUid}")
    public ResponseEntity<?> getUserRole(@PathVariable String firebaseUid) {
        Admin admin = adminRepository.findByFirebaseUid(firebaseUid);
        if (admin != null) return ResponseEntity.ok(java.util.Map.of("role", "admin", "user", admin));
        Organization org = organizationRepository.findByFirebaseUid(firebaseUid);
        if (org != null) return ResponseEntity.ok(java.util.Map.of("role", "organization", "user", org));
        Organizer organizer = organizerRepository.findByFirebaseUid(firebaseUid);
        if (organizer != null) return ResponseEntity.ok(java.util.Map.of("role", "organizer", "user", organizer));
        Participant participant = participantRepository.findByFirebaseUid(firebaseUid);
        if (participant != null) return ResponseEntity.ok(java.util.Map.of("role", "participant", "user", participant));
        return ResponseEntity.status(404).body("User not found");
    }
} 