import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  fetchEventsByIds,
  splitRunningPast,
  EventCard,
  fetchOrganizersByIds, // fallback if endpoint not present
} from "./shared"; 

const OrganizationPublic = ({ profile }) => {
  const [tab, setTab] = useState("about"); // about | gallery | organizers | events
  const [subTab, setSubTab] = useState("running"); // for events sub-tabs

  // organizers (table view like your example)
  const [organizers, setOrganizers] = useState([]);
  const [loadingOrganizers, setLoadingOrganizers] = useState(false);

  // events (running/past)
  const [events, setEvents] = useState({ running: [], past: [] });
  const [loadingEvents, setLoadingEvents] = useState(false);

  // --- Load ORGANIZERS when Organizers tab is opened ---
  useEffect(() => {
    if (tab !== "organizers") return;
    let cancelled = false;

    const loadOrganizers = async () => {
      setLoadingOrganizers(true);
      try {
        // 1) Try your endpoint (like your OrganizerList)
        const res = await axios.get(
          `http://localhost:2038/api/organizer/${profile.id}/verified-organizers`
        );
        if (!cancelled) setOrganizers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        // 2) Fallback to known organizerIds (if API is different or not available)
        try {
          const list = await fetchOrganizersByIds(profile.organizerIds || []);
          if (!cancelled) setOrganizers(list);
        } catch {
          if (!cancelled) setOrganizers([]);
        }
      } finally {
        if (!cancelled) setLoadingOrganizers(false);
      }
    };

    loadOrganizers();
    return () => {
      cancelled = true;
    };
  }, [tab, profile]);

  // --- Load EVENTS when Events tab is opened ---
  useEffect(() => {
    if (tab !== "events") return;
    let cancelled = false;

    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        const all = await fetchEventsByIds(profile.eventIds || []);
        if (!cancelled) {
          const { running, past } = splitRunningPast(all);
          console.log("OrganizationPublic Running Events:", running);
          console.log("OrganizationPublic Past Events:", past);
          setEvents({ running, past });
        }
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    };

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [tab, profile]);

  return (
    <div className="mt-4">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed">
        <button className={`tab ${tab === "about" ? "tab-active" : ""}`} onClick={() => setTab("about")}>
          About
        </button>
        <button className={`tab ${tab === "gallery" ? "tab-active" : ""}`} onClick={() => setTab("gallery")}>
          Gallery
        </button>
        <button className={`tab ${tab === "organizers" ? "tab-active" : ""}`} onClick={() => setTab("organizers")}>
          Organizers
        </button>
        <button className={`tab ${tab === "events" ? "tab-active" : ""}`} onClick={() => setTab("events")}>
          Organized Events
        </button>
      </div>

      {/* About */}
      {tab === "about" && (
        <div className="card bg-base-100 shadow mt-4">
          <div className="card-body">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><p className="font-medium">Name</p><p>{profile.name}</p></div>
              <div><p className="font-medium">Username</p><p>@{profile.username}</p></div>
              <div><p className="font-medium">Email</p><p>{profile.email}</p></div>
              <div><p className="font-medium">Verified</p><p>{profile.isVerified ? "Yes" : "No"}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      {tab === "gallery" && (
        <div className="card bg-base-100 shadow mt-4">
          <div className="card-body">
            {profile.pictureUrls?.length ? (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {profile.pictureUrls.map((url, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden">
                    <img
                      src={url}
                      onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/300x300?text=Image")}
                      alt={`gallery-${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-base-content/60">No images uploaded.</div>
            )}
          </div>
        </div>
      )}

      {/* Organizers — table view like your OrganizerList */}
      {tab === "organizers" && (
        <div className="card bg-base-100 shadow mt-4">
          <div className="card-body">
            {loadingOrganizers ? (
              <div className="flex justify-center items-center h-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : organizers.length === 0 ? (
              <div className="text-gray-500 text-center">No verified organizers found.</div>
            ) : (
              <div className="max-w-3xl mx-auto w-full">
                <h2 className="text-2xl font-bold mb-4">Verified Organizers</h2>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Username</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {organizers.map((org) => (
                        <tr key={org.id}>
                          <td>
                            <div className="avatar">
                              <div className="w-12 h-12 rounded-full">
                                <img
                                  src={org.profilePictureUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                                  alt={org.name}
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://img.daisyui.com/images/profile/demo/2@94.webp";
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                          <td>{org.name}</td>
                          <td>@{org.username}</td>
                          <td>{org.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organized Events with Running/Past sub-tabs */}
      {tab === "events" && (
        <div className="mt-4">
          <div role="tablist" className="tabs tabs-lifted">
            <button className={`tab ${subTab === "running" ? "tab-active" : ""}`} onClick={() => setSubTab("running")}>
              Running
            </button>
            <button className={`tab ${subTab === "past" ? "tab-active" : ""}`} onClick={() => setSubTab("past")}>
              Past
            </button>
          </div>

          <div className="mt-4">
            {loadingEvents ? (
              <div className="flex justify-center py-12">
                <span className="loading loading-spinner" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(subTab === "running" ? events.running : events.past).map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
                {(subTab === "running" ? events.running : events.past).length === 0 && (
                  <div className="text-base-content/60">No {subTab} events.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationPublic;
