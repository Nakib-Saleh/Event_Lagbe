package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Organization;
import com.eventlagbe.backend.Repository.OrganizationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "http://localhost:5173")
public class OrganizationController {

    @Autowired
    private OrganizationRepository organizationRepository;

    @GetMapping("/unverified")
    public ResponseEntity<List<Organization>> getUnverifiedOrganizations() {
        List<Organization> unverifiedOrganizations = organizationRepository.findByIsVerified(false);
        return ResponseEntity.ok(unverifiedOrganizations);
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
            organizationRepository.delete(organization);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
} 