package com.eventlagbe.backend.Repository;

import com.eventlagbe.backend.Models.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface EventRepository extends MongoRepository<Event, String> {
    Page<Event> findAll(Pageable pageable);
}


