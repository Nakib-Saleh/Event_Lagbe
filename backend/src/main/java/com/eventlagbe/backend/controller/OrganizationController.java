package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Organization;
import com.eventlagbe.backend.Repository.OrganizationRepository;
import com.eventlagbe.backend.Service.FirebaseService;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organization")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;
    
    @Autowired
    private FirebaseService firebaseService;

    @GetMapping("/unverified")
    public ResponseEntity<List<Organization>> getUnverifiedOrganizations() {
        List<Organization> unverifiedOrganizations = organizationRepository.findByIsVerified(false);
        return ResponseEntity.ok(unverifiedOrganizations);
    }

    @GetMapping
    public ResponseEntity<List<Organization>> getAllOrganizations() {
        return ResponseEntity.ok(organizationRepository.findAll());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Organization> approveOrganization(@PathVariable String id) {
        Organization organization = organizationRepository.findById(id).orElse(null);
        if (organization != null) {
            organization.setIsVerified(true);
            organizationRepository.save(organization);
            return ResponseEntity.ok(organization);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<Void> rejectOrganization(@PathVariable String id) {
        Organization organization = organizationRepository.findById(id).orElse(null);
        if (organization != null) {
            try {
                // Delete from Firebase first
                String firebaseUid = organization.getFirebaseUid();
                if (firebaseUid != null && !firebaseUid.isEmpty()) {
                    firebaseService.deleteUser(firebaseUid);
                }
                
                // Then delete from MongoDB
                organizationRepository.delete(organization);
                return ResponseEntity.ok().build();
            } catch (FirebaseAuthException e) {
                // If Firebase deletion fails, donot delete from MongoDB
                return ResponseEntity.internalServerError().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
} 