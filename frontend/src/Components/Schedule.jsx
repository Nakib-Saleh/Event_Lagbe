import { useState } from "react";

/**
 * Schedule.jsx
 * Fake schedule/timetable component with dummy events,
 * filtering by day, adding new events, and deleting.
 */

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
    </div>
  );
}
