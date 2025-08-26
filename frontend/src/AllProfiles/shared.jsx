import axios from "axios";
import React from "react";

export async function fetchEventsByIds(ids = []) {
  if (!ids?.length) return [];
  try {
    const { data } = await axios.get("http://localhost:2038/api/events", {
      params: { ids: ids.join(",") },
    });
    // accept array OR paged {content:[...]}
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
  } catch {}

  // fallback: fetch one by one
  const out = [];
  for (const id of ids) {
    try {
      const { data } = await axios.get(`http://localhost:2038/api/events/${id}`);
      out.push(data?.event ?? data); // accept either {event:...} or flat
    } catch {}
  }
  return out;
}


// ✅ ADD THIS
export async function fetchOrganizersByIds(ids = []) {
  if (!ids?.length) return [];
  try {
    const { data } = await axios.get("http://localhost:2038/api/events", {
      params: { ids: ids.join(",") },
    });
    
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
  } catch {}
  const out = [];
  for (const id of ids) {
    try {
      const { data } = await axios.get(`http://localhost:2038/api/organizer/${id}`);
      out.push(data);
    } catch {}
  }
  return out;
}

function normalizeEvent(e) {
  // if it has "event" nested, flatten it
  if (e?.event) {
    return { ...e.event, ...e }; 
  }
  return e;
}

export function splitRunningPast(events = []) {
  const flat = events.map(normalizeEvent);
  return {
    running: flat.filter(e => e.isActive),
    past: flat.filter(e => !e.isActive),
  };
}



export function EventCard({ event }) {
  return (
    <div className="card bg-base-100 border shadow-sm">
      <figure className="h-28 bg-base-200 overflow-hidden">
        <img
          src={event.bannerUrl || "https://static.vecteezy.com/system/resources/thumbnails/000/686/239/small_2x/bright-gradient-black-banner.jpg"}
          alt={event.title || event.id}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body p-4">
        <h4 className="font-semibold line-clamp-1">
          {event.title || `Event ${event.id}`}
        </h4>
        <div className="text-sm text-base-content/60">
          {event.isActive ? "Running" : "Past"}
        </div>
      </div>
    </div>
  );
}
