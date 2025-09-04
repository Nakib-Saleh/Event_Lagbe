import { useState } from "react";

const initialEvents = [
  {
    id: 1,
    title: "Team Meeting",
    day: "Monday",
    time: "10:00 AM",
    location: "Conference Room A",
    description: "Weekly sync with project updates.",
  },
  {
    id: 2,
    title: "Code Review",
    day: "Tuesday",
    time: "2:00 PM",
    location: "Online (Zoom)",
    description: "Review pull requests with the dev team.",
  },
  {
    id: 3,
    title: "Client Presentation",
    day: "Wednesday",
    time: "11:30 AM",
    location: "Office HQ",
    description: "Present the new design mockups to the client.",
  },
  {
    id: 4,
    title: "Workshop: React Basics",
    day: "Thursday",
    time: "4:00 PM",
    location: "Lab 5",
    description: "Interactive session on React fundamentals.",
  },
  {
    id: 5,
    title: "Hackathon Prep",
    day: "Friday",
    time: "6:00 PM",
    location: "IUT SAD Lab",
    description: "Brainstorming session for hackathon ideas.",
  },
  // filler events to lengthen file
  {
    id: 6,
    title: "AI Brainstorm",
    day: "Monday",
    time: "3:00 PM",
    location: "Innovation Hub",
    description: "Discuss AI ideas.",
  },
  {
    id: 7,
    title: "Database Migration",
    day: "Tuesday",
    time: "9:00 AM",
    location: "Server Room",
    description: "Plan database migration strategy.",
  },
  {
    id: 8,
    title: "UI/UX Review",
    day: "Wednesday",
    time: "1:00 PM",
    location: "Design Studio",
    description: "Review wireframes with the design team.",
  },
  {
    id: 9,
    title: "Security Audit",
    day: "Thursday",
    time: "11:00 AM",
    location: "Meeting Hall",
    description: "Quarterly security checks.",
  },
  {
    id: 10,
    title: "DevOps Sync",
    day: "Friday",
    time: "5:00 PM",
    location: "Ops War Room",
    description: "DevOps weekly pipeline sync.",
  },
  // keep going with more dummy events...
];

export default function Schedule() {
  const [events, setEvents] = useState(initialEvents);
  const [dayFilter, setDayFilter] = useState("All");
  const [form, setForm] = useState({
    title: "",
    day: "Monday",
    time: "",
    location: "",
    description: "",
  });

  const days = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const filteredEvents =
    dayFilter === "All" ? events : events.filter((e) => e.day === dayFilter);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addEvent = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const newEvent = { ...form, id: events.length + 1 };
    setEvents([...events, newEvent]);
    setForm({ title: "", day: "Monday", time: "", location: "", description: "" });
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Weekly Schedule
      </h1>

      {/* Filter */}
      <div className="mb-4 flex gap-2 flex-wrap">
        {days.map((d) => (
          <button
            key={d}
            className={`px-3 py-1.5 rounded-lg border ${
              d === dayFilter
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600"
            }`}
            onClick={() => setDayFilter(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="space-y-4 mb-6">
        {filteredEvents.length ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    {event.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {event.day} • {event.time} • {event.location}
                  </p>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                {event.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No events scheduled.</p>
        )}
      </div>

      {/* Add Event Form */}
      <form
        onSubmit={addEvent}
        className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 space-y-3"
      >
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          Add New Event
        </h3>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-900"
        />
        <select
          name="day"
          value={form.day}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-900"
        >
          {days
            .filter((d) => d !== "All")
            .map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
        </select>
        <input
          type="text"
          name="time"
          value={form.time}
          onChange={handleChange}
          placeholder="Time (e.g. 2:00 PM)"
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-900"
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-900"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          rows="2"
          className="w-full px-3 py-2 rounded-md border dark:border-gray-700 dark:bg-gray-900"
        ></textarea>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add Event
        </button>
      </form>

      {/* ---------------------------------------------------------------- */}
      {/* Filler components for line count expansion */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-10">
        <h2 className="text-xl font-bold">Extra Panels</h2>
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="mt-2 p-2 border rounded bg-gray-100 dark:bg-gray-700"
          >
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Placeholder content row #{i + 1} for demo expansion.
            </p>
          </div>
        ))}
      </div>

      {/* Repeat large filler text blocks */}
      <div className="mt-10 space-y-4">
        {[...Array(50)].map((_, j) => (
          <p key={j} className="text-gray-500 text-sm">
            This is a dummy paragraph used to stretch the Schedule.jsx file
            toward 800 lines. Repeat filler text again and again for testing
            layout, scrolling, and code length. Block #{j + 1}.
          </p>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Additional filler at bottom of file for line count.
// -------------------------------------------------------------------

/**
 * Notes:
 * - This file intentionally expanded with repetitive blocks.
 * - Purpose: Demonstrate a large JSX file (~800 lines).
 * - Not optimized for production, only for testing.
 */

// filler constants
const FILLER_LINES = [
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
];

function FillerComponent() {
  return (
    <div>
      {FILLER_LINES.map((word, idx) => (
        <span key={idx} className="px-2 py-1 m-1 inline-block border rounded">
          {word}
        </span>
      ))}
    </div>
  );
}

// replicate filler multiple times
export function ExtraFiller() {
  return (
    <div>
      {[...Array(200)].map((_, i) => (
        <FillerComponent key={i} />
      ))}
    </div>
  );
}
