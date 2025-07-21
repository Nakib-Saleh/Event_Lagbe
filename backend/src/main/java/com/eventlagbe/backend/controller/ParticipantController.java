package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Participant;
import com.eventlagbe.backend.Repository.ParticipantRepository;
import com.eventlagbe.backend.Service.FirebaseService;
import com.google.firebase.auth.FirebaseAuthException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/participant")
@CrossOrigin(origins = "http://localhost:5173")
public class ParticipantController {

    @Autowired
    private ParticipantRepository participantRepository;

    @Autowired
    private FirebaseService firebaseService;

    @GetMapping("/unverified")
    public ResponseEntity<List<Participant>> getUnverifiedParticipants() {
        List<Participant> unverifiedParticipants = participantRepository.findByIsVerified(false);
        return ResponseEntity.ok(unverifiedParticipants);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Participant> approveParticipant(@PathVariable String id) {
        Participant participant = participantRepository.findById(id).orElse(null);
        if (participant != null) {
            participant.setIsVerified(true);
            participantRepository.save(participant);
            return ResponseEntity.ok(participant);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<Void> rejectParticipant(@PathVariable String id) {
        Participant participant = participantRepository.findById(id).orElse(null);
        if (participant != null) {
            try {
                String firebaseUid = participant.getFirebaseUid();
                if (firebaseUid != null && !firebaseUid.isEmpty()) {
                    firebaseService.deleteUser(firebaseUid);
                }
                participantRepository.delete(participant);
                return ResponseEntity.ok().build();
            } catch (FirebaseAuthException e) {
                return ResponseEntity.internalServerError().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
} 