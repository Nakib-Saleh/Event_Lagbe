package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Event;
import com.eventlagbe.backend.Models.EventTimeslot;
import com.eventlagbe.backend.Models.Organization;
import com.eventlagbe.backend.Models.Organizer;
import com.eventlagbe.backend.Models.Participant;
import com.eventlagbe.backend.Repository.EventRepository;
import com.eventlagbe.backend.Repository.EventTimeslotRepository;
import com.eventlagbe.backend.Repository.OrganizationRepository;
import com.eventlagbe.backend.Repository.OrganizerRepository;
import com.eventlagbe.backend.Repository.ParticipantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private EventTimeslotRepository timeslotRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private OrganizerRepository organizerRepository;

    @Autowired
    private ParticipantRepository participantRepository;

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_DATE_TIME;

    private LocalDateTime parseToLocalDateTime(Object value) {
        if (value == null) return null;
        String s = value.toString();
        
        // Try parsing as date only (YYYY-MM-DD format)
        try {
            if (s.matches("\\d{4}-\\d{2}-\\d{2}")) {
                return LocalDate.parse(s).atStartOfDay();
            }
        } catch (Exception ignored) {
        }
        
        // Try parsing as ISO instant first (most common from frontend)
        try {
            return Instant.parse(s).atZone(ZoneOffset.UTC).toLocalDateTime();
        } catch (Exception ignored) {
        }
        
        // Try parsing as ISO offset date time
        try {
            return OffsetDateTime.parse(s, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
        } catch (Exception ignored) {
        }
        
        // Try parsing as ISO local date time
        try {
            return LocalDateTime.parse(s, ISO);
        } catch (Exception ignored) {
        }
        
        // Try parsing as simple local date time
        try {
            return LocalDateTime.parse(s);
        } catch (Exception ignored) {
        }
        
        // Try parsing as Date object (for JavaScript Date.toISOString())
        try {
            return Instant.parse(s).atZone(ZoneOffset.UTC).toLocalDateTime();
        } catch (Exception ignored) {
        }
        
        System.out.println("Failed to parse date: " + s);
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        // Expected payload keys: ownerId, title, description, location, eventType, eventScope, 
        // requiredSkills[], coHosts[], sponsors[], coverImageUrl, tags[], timeslots[]
        Event event = new Event();
        event.setOwnerId((String) payload.get("ownerId"));
        event.setTitle((String) payload.get("title"));
        event.setDescription((String) payload.get("description"));
        event.setLocation((String) payload.get("location"));
        event.setEventType((String) payload.get("eventType"));
        event.setEventScope((String) payload.get("eventScope"));
        event.setCoverImageUrl((String) payload.get("coverImageUrl"));

        // Handle requiredSkills (skill names)
        if (payload.get("requiredSkills") instanceof List<?> skills) {
            event.setRequiredSkills(skills.stream().map(Object::toString).collect(Collectors.toList()));
        }
        
        // Handle coHosts (IDs)
        if (payload.get("coHosts") instanceof List<?> coHosts) {
            event.setCoHosts(coHosts.stream().map(Object::toString).collect(Collectors.toList()));
        }
        
        // Handle sponsors (names)
        if (payload.get("sponsors") instanceof List<?> sponsors) {
            event.setSponsors(sponsors.stream().map(Object::toString).collect(Collectors.toList()));
        }
        
        if (payload.get("tags") instanceof List<?> tags) {
            event.setTags(tags.stream().map(Object::toString).collect(Collectors.toList()));
        }

        Event saved = eventRepository.save(event);

        // Update creator's eventIds list
        String ownerId = saved.getOwnerId();
        if (ownerId != null) {
            // First try to find as Organization
            Organization organization = organizationRepository.findByFirebaseUid(ownerId);
            if (organization != null) {
                // Update organization's eventIds
                List<String> eventIds = organization.getEventIds();
                if (eventIds == null) {
                    eventIds = new ArrayList<>();
                }
                if (!eventIds.contains(saved.getId())) {
                    eventIds.add(saved.getId());
                    organization.setEventIds(eventIds);
                    organizationRepository.save(organization);
                }
            } else {
                // Try to find as Organizer
                Organizer organizer = organizerRepository.findByFirebaseUid(ownerId);
                if (organizer != null) {
                    // Update organizer's eventIds
                    List<String> eventIds = organizer.getEventIds();
                    if (eventIds == null) {
                        eventIds = new ArrayList<>();
                    }
                    if (!eventIds.contains(saved.getId())) {
                        eventIds.add(saved.getId());
                        organizer.setEventIds(eventIds);
                        organizerRepository.save(organizer);
                    }
                }
            }
        }

        // Save timeslots
        if (payload.get("timeslots") instanceof List<?> timeslots) {
            System.out.println("Received timeslots: " + timeslots);
            for (Object obj : timeslots) {
                if (obj instanceof Map<?, ?> m) {
                    EventTimeslot ts = new EventTimeslot();
                    ts.setEventId(saved.getId());
                    Object titleObj = m.get("title");
                    ts.setTitle(titleObj != null ? titleObj.toString() : "Session");
                    Object s = m.get("start");
                    Object e = m.get("end");
                    
                    System.out.println("Parsing start: " + s + " (type: " + (s != null ? s.getClass().getSimpleName() : "null") + ")");
                    System.out.println("Parsing end: " + e + " (type: " + (e != null ? e.getClass().getSimpleName() : "null") + ")");
                    
                    LocalDateTime start = parseToLocalDateTime(s);
                    LocalDateTime end = parseToLocalDateTime(e);
                    
                    System.out.println("Parsed start: " + start);
                    System.out.println("Parsed end: " + end);
                    
                    if (start != null) ts.setStart(start);
                    if (end != null) ts.setEnd(end);
                    
                    // Only save if we have at least a start time
                    if (start != null) {
                        timeslotRepository.save(ts);
                        System.out.println("✅ Saved timeslot: " + ts.getTitle() + " from " + start + " to " + end);
                    } else {
                        System.out.println("❌ Skipping timeslot with null start time: " + ts.getTitle());
                    }
                }
            }
        }

        return ResponseEntity.ok(Map.of("event", saved, "timeslots", timeslotRepository.findByEventId(saved.getId())));
    }

    @GetMapping
    public ResponseEntity<?> listEvents(@RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Event> events = eventRepository.findAll(pageable);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEvent(@PathVariable String id) {
        return eventRepository.findById(id)
                .map(e -> ResponseEntity.ok(Map.of(
                        "event", e,
                        "timeslots", timeslotRepository.findByEventId(e.getId())
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{eventId}/bookmark")
    public ResponseEntity<?> toggleBookmark(@PathVariable String eventId, @RequestBody Map<String, String> payload) {
        String participantId = payload.get("participantId");
        if (participantId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Participant ID is required"));
        }

        try {
            // Find the participant
            Participant participant = participantRepository.findByFirebaseUid(participantId);
            if (participant == null) {
                return ResponseEntity.notFound().build();
            }

            // Find the event
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            List<String> bookmarkedEventIds = participant.getBookmarkedEventIds();
            if (bookmarkedEventIds == null) {
                bookmarkedEventIds = new ArrayList<>();
            }

            List<String> bookmarkedBy = event.getBookmarkedBy();
            if (bookmarkedBy == null) {
                bookmarkedBy = new ArrayList<>();
            }

            boolean isBookmarked = bookmarkedEventIds.contains(eventId);
            
            if (isBookmarked) {
                // Remove bookmark
                bookmarkedEventIds.remove(eventId);
                bookmarkedBy.remove(participantId);
                event.setInterestedCount(Math.max(0, event.getInterestedCount() - 1));
            } else {
                // Add bookmark
                bookmarkedEventIds.add(eventId);
                bookmarkedBy.add(participantId);
                event.setInterestedCount(event.getInterestedCount() + 1);
            }

            // Save both participant and event
            participant.setBookmarkedEventIds(bookmarkedEventIds);
            participantRepository.save(participant);
            eventRepository.save(event);

            return ResponseEntity.ok(Map.of(
                "isBookmarked", !isBookmarked,
                "interestedCount", event.getInterestedCount()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to toggle bookmark"));
        }
    }

    @PostMapping("/{eventId}/going")
    public ResponseEntity<?> toggleGoing(@PathVariable String eventId, @RequestBody Map<String, String> payload) {
        String participantId = payload.get("participantId");
        if (participantId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Participant ID is required"));
        }

        try {
            // Find the participant
            Participant participant = participantRepository.findByFirebaseUid(participantId);
            if (participant == null) {
                return ResponseEntity.notFound().build();
            }

            // Find the event
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event == null) {
                return ResponseEntity.notFound().build();
            }

            List<String> registeredEventIds = participant.getRegisteredEventIds();
            if (registeredEventIds == null) {
                registeredEventIds = new ArrayList<>();
            }

            boolean isGoing = registeredEventIds.contains(eventId);
            
            if (isGoing) {
                // Remove from going
                registeredEventIds.remove(eventId);
                event.setGoingCount(Math.max(0, event.getGoingCount() - 1));
            } else {
                // Add to going
                registeredEventIds.add(eventId);
                event.setGoingCount(event.getGoingCount() + 1);
            }

            // Save both participant and event
            participant.setRegisteredEventIds(registeredEventIds);
            participantRepository.save(participant);
            eventRepository.save(event);

            return ResponseEntity.ok(Map.of(
                "isGoing", !isGoing,
                "goingCount", event.getGoingCount()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to toggle going status"));
        }
    }

    @GetMapping("/{eventId}/user-status")
    public ResponseEntity<?> getUserStatus(@PathVariable String eventId, @RequestParam String participantId) {
        try {
            // Find the participant
            Participant participant = participantRepository.findByFirebaseUid(participantId);
            if (participant == null) {
                return ResponseEntity.ok(Map.of(
                    "isBookmarked", false,
                    "isGoing", false
                ));
            }

            List<String> bookmarkedEventIds = participant.getBookmarkedEventIds();
            List<String> registeredEventIds = participant.getRegisteredEventIds();

            boolean isBookmarked = bookmarkedEventIds != null && bookmarkedEventIds.contains(eventId);
            boolean isGoing = registeredEventIds != null && registeredEventIds.contains(eventId);

            return ResponseEntity.ok(Map.of(
                "isBookmarked", isBookmarked,
                "isGoing", isGoing
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to get user status"));
        }
    }
}


