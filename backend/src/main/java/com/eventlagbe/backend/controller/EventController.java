package com.eventlagbe.backend.Controller;

import com.eventlagbe.backend.Models.Event;
import com.eventlagbe.backend.Models.EventTimeslot;
import com.eventlagbe.backend.Repository.EventRepository;
import com.eventlagbe.backend.Repository.EventTimeslotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.time.format.DateTimeFormatter;
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

    private static final DateTimeFormatter ISO = DateTimeFormatter.ISO_DATE_TIME;

    private LocalDateTime parseToLocalDateTime(Object value) {
        if (value == null) return null;
        String s = value.toString();
        try {
            return LocalDateTime.parse(s, ISO);
        } catch (Exception ignored) {
        }
        try {
            return OffsetDateTime.parse(s, DateTimeFormatter.ISO_OFFSET_DATE_TIME).toLocalDateTime();
        } catch (Exception ignored) {
        }
        try {
            return Instant.parse(s).atZone(ZoneOffset.UTC).toLocalDateTime();
        } catch (Exception ignored) {
        }
        // fallback: try without formatter
        try {
            return LocalDateTime.parse(s);
        } catch (Exception ignored) {
        }
        return null;
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Map<String, Object> payload) {
        // Expected payload keys: title, description, location, eventType, organizationId, requiredSkillIds[], sponsorNames[], coverImageUrl, tags[], schedules[]
        Event event = new Event();
        event.setTitle((String) payload.get("title"));
        event.setDescription((String) payload.get("description"));
        event.setLocation((String) payload.get("location"));
        event.setEventType((String) payload.get("eventType"));
        event.setOrganizationId((String) payload.get("organizationId"));
        event.setCoverImageUrl((String) payload.get("coverImageUrl"));

        if (payload.get("requiredSkillIds") instanceof List<?> skills) {
            event.setRequiredSkillIds(skills.stream().map(Object::toString).collect(Collectors.toList()));
        }
        if (payload.get("sponsorNames") instanceof List<?> sponsors) {
            event.setSponsorNames(sponsors.stream().map(Object::toString).collect(Collectors.toList()));
        }
        if (payload.get("tags") instanceof List<?> tags) {
            event.setTags(tags.stream().map(Object::toString).collect(Collectors.toList()));
        }

        Event saved = eventRepository.save(event);

        // Save timeslots
        if (payload.get("schedules") instanceof List<?> schedules) {
            for (Object obj : schedules) {
                if (obj instanceof Map<?, ?> m) {
                    EventTimeslot ts = new EventTimeslot();
                    ts.setEventId(saved.getId());
                    Object titleObj = m.get("title");
                    ts.setTitle(titleObj != null ? titleObj.toString() : "Session");
                    Object s = m.get("start");
                    Object e = m.get("end");
                    LocalDateTime start = parseToLocalDateTime(s);
                    LocalDateTime end = parseToLocalDateTime(e);
                    if (start != null) ts.setStart(start);
                    if (end != null) ts.setEnd(end);
                    Object ad = m.get("allDay");
                    ts.setAllDay(ad instanceof Boolean b ? b : false);
                    timeslotRepository.save(ts);
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
}


