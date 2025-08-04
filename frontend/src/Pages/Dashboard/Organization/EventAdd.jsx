import React, { useState } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUsers, FiImage, FiGlobe, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineEmojiEvents, MdOutlineDescription } from 'react-icons/md';
import { toast } from 'react-hot-toast';

const EventAdd = () => {
  const [formData, setFormData] = useState({
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newSponsor, setNewSponsor] = useState('');

  // Mock data for organizations and organizers
  const mockOrganizations = [
    { id: '1', name: 'TechCorp Inc.', type: 'organization', email: 'contact@techcorp.com' },
    { id: '2', name: 'Digital Solutions Ltd.', type: 'organization', email: 'info@digitalsolutions.com' },
    { id: '3', name: 'John Smith', type: 'organizer', email: 'john.smith@email.com' },
    { id: '4', name: 'Sarah Johnson', type: 'organizer', email: 'sarah.johnson@email.com' },
    { id: '5', name: 'Innovation Hub', type: 'organization', email: 'hello@innovationhub.com' },
  ];

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
    if (query.trim()) {
      const filtered = mockOrganizations.filter(org => 
        org.name.toLowerCase().includes(query.toLowerCase()) ||
        org.email.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
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
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Event created successfully!');
      setIsSubmitting(false);
      // Reset form
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
    }, 2000);
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Select a category</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
                <option value="technology">Technology</option>
                <option value="arts">Arts & Culture</option>
                <option value="food">Food & Drink</option>
                <option value="charity">Charity</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Date & Time Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiCalendar className="text-green-600 text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Date & Time</h2>
              <p className="text-gray-500 text-sm">When is your event happening?</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                min={formData.startDate}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* End Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
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
                  {searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result) => (
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