import React, { useEffect, useState } from 'react';
import { FiCalendar, FiMapPin, FiUsers, FiImage, FiGlobe } from 'react-icons/fi';
import { MdOutlineEmojiEvents, MdOutlineDescription } from 'react-icons/md';
import { toast, Toaster } from 'react-hot-toast';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { uploadToCloudinary } from '../../../utils/cloudinaryUpload';
import { useNavigate } from 'react-router-dom';

const EventAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    eventType: 'on-site',
    requiredSkills: [], // array of { id, name }
    coHosts: [],
    sponsors: [],
    coverImage: null,
    tags: [],
    schedules: [] // array of { id, title, start, end, allDay }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newSponsor, setNewSponsor] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState(null);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        setSkillsLoading(true);
        const res = await fetch('http://localhost:2038/api/skills');
        const data = await res.json();
        setSkills(Array.isArray(data) ? data : []);
      } catch {
        setSkillsError('Failed to load skills');
        setSkills([]);
      } finally {
        setSkillsLoading(false);
      }
    };
    loadSkills();
  }, []);

  // Calendar state
  const [calendarModal, setCalendarModal] = useState(null); // null | { data, title }
  const [currentCalendarEvents, setCurrentCalendarEvents] = useState([]);

  // Mock data for organizations and organizers
  // Remote search for organizations and organizers
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(0);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const fetchDirectory = async (query, page = 0) => {
    if (!query || !query.trim()) return [];
    try {
      setSearching(true);
      const [orgRes, orgzRes] = await Promise.all([
        fetch(`http://localhost:2038/api/organization?q=${encodeURIComponent(query)}&page=${page}&size=5`).then(r => r.json()),
        fetch(`http://localhost:2038/api/organizer?q=${encodeURIComponent(query)}&page=${page}&size=5`).then(r => r.json()),
      ]);
      const mapOrg = (o) => ({ id: o.id, name: o.name || o.username || o.email, type: 'organization', email: o.email });
      const mapOrgz = (p) => ({ id: p.id, name: p.name || p.username || p.email, type: 'organizer', email: p.email });
      const orgContent = orgRes?.content ?? orgRes ?? [];
      const orgzContent = orgzRes?.content ?? orgzRes ?? [];
      const items = [...orgContent.map(mapOrg), ...orgzContent.map(mapOrgz)];
      const hasMore = (orgRes?.last === false) || (orgzRes?.last === false);
      return { items, hasMore };
    } catch {
      return { items: [], hasMore: false };
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        coverImage: file
      }));
    }
  };

  const handleSearchCoHosts = (query) => {
    setSearchQuery(query);
    setSearchPage(0);
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery && searchQuery.trim()) {
        const { items, hasMore } = await fetchDirectory(searchQuery, 0);
        setSearchResults(items);
        setSearchHasMore(hasMore);
        setSearchPage(0);
      } else {
        setSearchResults([]);
        setSearchHasMore(false);
        setSearchPage(0);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMoreResults = async () => {
    const nextPage = searchPage + 1;
    const { items, hasMore } = await fetchDirectory(searchQuery, nextPage);
    setSearchResults(prev => [...prev, ...items]);
    setSearchHasMore(hasMore);
    setSearchPage(nextPage);
  };

  const handleAddCoHost = (coHost) => {
    if (!formData.coHosts.find(host => host.id === coHost.id)) {
      setFormData(prev => ({
        ...prev,
        coHosts: [...prev.coHosts, coHost]
      }));
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleRemoveCoHost = (coHostId) => {
    setFormData(prev => ({
      ...prev,
      coHosts: prev.coHosts.filter(host => host.id !== coHostId)
    }));
  };

  const handleAddSponsor = () => {
    if (newSponsor.trim() && !formData.sponsors.includes(newSponsor.trim())) {
      setFormData(prev => ({
        ...prev,
        sponsors: [...prev.sponsors, newSponsor.trim()]
      }));
      setNewSponsor('');
    }
  };

  const handleRemoveSponsor = (sponsorToRemove) => {
    setFormData(prev => ({
      ...prev,
      sponsors: prev.sponsors.filter(sponsor => sponsor !== sponsorToRemove)
    }));
  };

  const handleSponsorKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSponsor();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let coverImageUrl = null;
      if (formData.coverImage) {
        // Upload to Cloudinary first
        const uploadRes = await uploadToCloudinary(formData.coverImage);
        coverImageUrl = uploadRes?.secure_url || uploadRes?.url || null;
        if (!coverImageUrl) {
          throw new Error('Image upload failed');
        }
      }
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        eventType: formData.eventType,
        organizationId: formData.coHosts.find(h => h.type === 'organization')?.id || null,
        requiredSkillIds: formData.requiredSkills.map(s => s.id),
        sponsorNames: formData.sponsors,
        coverImageUrl,
        tags: formData.tags,
        schedules: formData.schedules.map(s => ({
          title: s.title,
          start: s.start,
          end: s.end,
          allDay: s.allDay,
        })),
      };

      const res = await fetch('http://localhost:2038/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create event');
      await res.json();
      toast.success('Event created successfully!');
      setTimeout(() => {
        navigate('/organizationDashboard');
      }, 800);
      setFormData({
        title: '',
        description: '',
        location: '',
        eventType: 'on-site',
        requiredSkills: [],
        coHosts: [],
        sponsors: [],
        coverImage: null,
        tags: [],
        schedules: []
      });
    } catch {
      toast.error('Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar handlers
  const handleCalendarSelect = (selected) => {
    // open modal to enter a label (optional)
    setCalendarModal({ data: selected, title: formData.title || '' });
  };

  const addCalendarTimeslot = () => {
    if (!calendarModal) return;
    const calendarApi = calendarModal.data.view.calendar;
    calendarApi.unselect();
    const id = `${calendarModal.data.startStr}-${calendarModal.data.endStr}-${Date.now()}`;
    calendarApi.addEvent({
      id,
      title: calendarModal.title || 'Session',
      start: calendarModal.data.startStr,
      end: calendarModal.data.endStr,
      allDay: calendarModal.data.allDay,
    });
    setCalendarModal(null);
  };

  const handleCalendarEventClick = (selected) => {
    // remove on click confirm
    if (confirm('Remove this timeslot?')) {
      selected.event.remove();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Event</h1>
        <p className="text-gray-600">Share your event with the world</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <MdOutlineEmojiEvents className="text-blue-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
              <p className="text-gray-500 text-sm">Tell people about your event</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="What's your event called?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe your event..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                required
              />
            </div>

            {/* Required Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {formData.requiredSkills.map((s) => (
                    <span key={s.id} className="badge badge-outline gap-2">
                      {s.name}
                      <button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        requiredSkills: prev.requiredSkills.filter(rs => rs.id !== s.id)
                      }))} className="text-red-500">✕</button>
                    </span>
                  ))}
                </div>
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    value=""
                    onChange={(e) => {
                      const skill = skills.find(sk => (sk.id || sk._id) === e.target.value);
                      if (skill && !formData.requiredSkills.some(rs => rs.id === (skill.id || skill._id))) {
                        setFormData(prev => ({
                          ...prev,
                          requiredSkills: [...prev.requiredSkills, { id: skill.id || skill._id, name: skill.name }]
                        }));
                      }
                    }}
                    disabled={skillsLoading || skillsError}
                  >
                    <option value="">{skillsLoading ? 'Loading skills...' : (skillsError || 'Add a skill')}</option>
                    {skills.map(sk => (
                      <option key={sk.id || sk._id} value={sk.id || sk._id}>{sk.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date & Time Section - Calendar based multi-timeslot selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiCalendar className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Date & Time</h2>
              <p className="text-gray-500 text-sm">Select one or multiple time slots from the calendar below</p>
            </div>
          </div>

          <div className="mb-4">
            <FullCalendar
              height="60vh"
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              initialView="dayGridMonth"
              selectable={true}
              selectMirror={true}
              editable={true}
              select={handleCalendarSelect}
              eventClick={handleCalendarEventClick}
              eventsSet={(events) => {
                setCurrentCalendarEvents(events);
                // keep a plain representation in form data
                const schedules = events.map(e => ({
                  id: e.id,
                  title: e.title,
                  start: e.startStr || e.start?.toISOString(),
                  end: e.endStr || e.end?.toISOString(),
                  allDay: e.allDay,
                }));
                setFormData(prev => ({ ...prev, schedules }));
              }}
            />
          </div>

          {/* Modal to confirm adding a selected range */}
          {calendarModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">Add Timeslot</h3>
                <label className="block text-sm font-medium text-gray-700 mt-4">Label (optional)</label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-2"
                  placeholder="Session title"
                  value={calendarModal.title}
                  onChange={e => setCalendarModal(m => ({ ...m, title: e.target.value }))}
                />
                <div className="modal-action">
                  <button className="btn btn-outline" onClick={() => setCalendarModal(null)}>Cancel</button>
                  <button className="btn btn-success" onClick={addCalendarTimeslot}>Add</button>
                </div>
              </div>
            </div>
          )}

          {/* Selected timeslots summary */}
          <div className="mt-6">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Selected Timeslots ({currentCalendarEvents.length})</h4>
            {currentCalendarEvents.length === 0 ? (
              <p className="text-sm text-gray-500">No timeslots selected yet. Drag on the calendar to add.</p>
            ) : (
              <div className="space-y-2">
                {currentCalendarEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{evt.title || 'Session'}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(evt.start).toLocaleString()} — {evt.end ? new Date(evt.end).toLocaleString() : ''}
                      </p>
                    </div>
                    <button className="btn btn-sm btn-outline btn-error" onClick={() => evt.remove()}>Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <FiMapPin className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
              <p className="text-gray-500 text-sm">Where is your event taking place?</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Event Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="eventType"
                    value="on-site"
                    checked={formData.eventType === 'on-site'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-blue-600" />
                    <span className="font-medium">On-Site Event</span>
                  </div>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    name="eventType"
                    value="online"
                    checked={formData.eventType === 'online'}
                    onChange={handleInputChange}
                    className="mr-3"
                  />
                  <div className="flex items-center gap-2">
                    <FiGlobe className="text-green-600" />
                    <span className="font-medium">Online Event</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter event location or write Online"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <FiUsers className="text-orange-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Additional Details</h2>
              <p className="text-gray-500 text-sm">Make your event more engaging</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Co-Hosts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Co-Hosts
              </label>
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                    <input
                    type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchCoHosts(e.target.value)}
                    placeholder="Search organizations or organizers..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                    {searchQuery && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searching && (
                        <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                      )}
                      {!searching && searchResults.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                      )}
                      {!searching && searchResults.map((result) => (
                        <div
                          key={result.id}
                          onClick={() => handleAddCoHost(result)}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{result.name}</p>
                              <p className="text-sm text-gray-500">{result.email}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              result.type === 'organization' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {result.type}
                            </span>
                          </div>
                        </div>
                      ))}
                        {!searching && searchHasMore && (
                          <button
                            type="button"
                            onClick={loadMoreResults}
                            className="w-full text-center py-2 text-blue-600 hover:bg-blue-50"
                          >
                            Load more
                          </button>
                        )}
                    </div>
                  )}
                </div>

                {/* Selected Co-Hosts */}
                {formData.coHosts.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Co-Hosts:</p>
                    <div className="space-y-2">
                      {formData.coHosts.map((coHost) => (
                        <div
                          key={coHost.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              coHost.type === 'organization' 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {coHost.type === 'organization' ? 'O' : 'P'}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{coHost.name}</p>
                              <p className="text-sm text-gray-500">{coHost.email}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveCoHost(coHost.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sponsors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sponsors
              </label>
              <div className="space-y-4">
                {/* Add Sponsor Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSponsor}
                    onChange={(e) => setNewSponsor(e.target.value)}
                    onKeyPress={handleSponsorKeyPress}
                    placeholder="Enter sponsor name..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddSponsor}
                    disabled={!newSponsor.trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Selected Sponsors */}
                {formData.sponsors.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Event Sponsors:</p>
                    <div className="space-y-2">
                      {formData.sponsors.map((sponsor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center font-medium">
                              S
                            </div>
                            <span className="font-medium text-gray-900">{sponsor}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveSponsor(sponsor)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="coverImage"
                />
                <label htmlFor="coverImage" className="cursor-pointer">
                  <FiImage className="mx-auto text-gray-400 text-3xl mb-2" />
                  <p className="text-gray-600 mb-1">
                    {formData.coverImage ? formData.coverImage.name : 'Click to upload cover image'}
                  </p>
                  <p className="text-gray-400 text-sm">PNG, JPG up to 5MB</p>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-6">
          <button
            type="button"
            onClick={() => {
              setFormData({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                location: '',
                eventType: 'on-site',
                category: '',
                coHosts: [],
                sponsors: [],
                coverImage: null,
                tags: []
              });
            }}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Event...
              </>
            ) : (
              'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventAdd