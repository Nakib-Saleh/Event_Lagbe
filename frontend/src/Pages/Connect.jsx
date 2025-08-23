import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUsers, FiMapPin, FiCalendar, FiStar, FiPlus, FiCheckCircle, FiSearch, FiFilter, FiTrendingUp, FiAward, FiGlobe, FiHeart } from "react-icons/fi";
import { MdOutlineEmojiEvents, MdOutlineSchool, MdOutlineGroups, MdOutlineBusinessCenter } from "react-icons/md";

const Connect = () => {
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState("participants");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFollow = (userId) => {
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const participants = [
    {
      id: 1,
      name: "Ahmed Rahman",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "1.2K",
      mutualFriends: 5,
      skills: ["Web Development", "React", "Node.js"],
      university: "BUET",
      department: "Computer Science",
      eventsAttended: 12,
      rating: 4.8
    },
    {
      id: 2,
      name: "Sadia Islam",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "856",
      mutualFriends: 8,
      skills: ["Data Science", "Python", "Machine Learning"],
      university: "DU",
      department: "Statistics",
      eventsAttended: 8,
      rating: 4.6
    },
    {
      id: 3,
      name: "Rahim Ali",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "2.1K",
      mutualFriends: 15,
      skills: ["Marketing", "Business", "Leadership"],
      university: "BRAC",
      department: "Business Administration",
      eventsAttended: 15,
      rating: 4.9
    },
    {
      id: 4,
      name: "Fatima Khan",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "3.5K",
      mutualFriends: 12,
      skills: ["Event Management", "Leadership", "Communication"],
      university: "NSU",
      department: "Media Studies",
      eventsAttended: 20,
      rating: 4.7
    },
    {
      id: 5,
      name: "Karim Hassan",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "1.8K",
      mutualFriends: 7,
      skills: ["Mobile Development", "Flutter", "Firebase"],
      university: "IUB",
      department: "Software Engineering",
      eventsAttended: 10,
      rating: 4.5
    },
    {
      id: 6,
      name: "Nadia Ahmed",
      role: "Student",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "2.3K",
      mutualFriends: 18,
      skills: ["UI/UX Design", "Figma", "Prototyping"],
      university: "AIUB",
      department: "Graphic Design",
      eventsAttended: 14,
      rating: 4.8
    }
  ];

  const organizers = [
    {
      id: 7,
      name: "Sarah Johnson",
      role: "Organizer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "5.2K",
      mutualFriends: 25,
      skills: ["Event Planning", "Team Management", "Marketing"],
      organization: "Tech Events BD",
      eventsOrganized: 45,
      rating: 4.9,
      specialization: "Technology Events"
    },
    {
      id: 8,
      name: "Michael Chen",
      role: "Organizer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "3.8K",
      mutualFriends: 20,
      skills: ["Workshop Management", "Education", "Training"],
      organization: "EduConnect",
      eventsOrganized: 32,
      rating: 4.7,
      specialization: "Educational Workshops"
    },
    {
      id: 9,
      name: "Emily Rodriguez",
      role: "Organizer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "4.1K",
      mutualFriends: 16,
      skills: ["Conference Planning", "Networking", "Business Development"],
      organization: "Business Network BD",
      eventsOrganized: 28,
      rating: 4.8,
      specialization: "Business Conferences"
    },
    {
      id: 10,
      name: "David Wilson",
      role: "Organizer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "2.9K",
      mutualFriends: 12,
      skills: ["Hackathon Planning", "Innovation", "Startup Events"],
      organization: "Innovation Hub",
      eventsOrganized: 22,
      rating: 4.6,
      specialization: "Hackathons & Innovation"
    }
  ];

  const organizations = [
    {
      id: 11,
      name: "BUET Computer Club",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "8.9K",
      mutualFriends: 23,
      skills: ["Technology", "Innovation", "Education"],
      location: "Dhaka",
      eventsOrganized: 156,
      rating: 4.9,
      memberCount: "500+",
      description: "Leading technology club at BUET"
    },
    {
      id: 12,
      name: "Dhaka Tech Hub",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "15.2K",
      mutualFriends: 45,
      skills: ["Startup", "Innovation", "Technology"],
      location: "Dhaka",
      eventsOrganized: 89,
      rating: 4.8,
      memberCount: "1000+",
      description: "Premier tech startup ecosystem"
    },
    {
      id: 13,
      name: "BRAC Innovation Lab",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "12.5K",
      mutualFriends: 38,
      skills: ["Research", "Innovation", "Social Impact"],
      location: "Dhaka",
      eventsOrganized: 67,
      rating: 4.7,
      memberCount: "800+",
      description: "Social innovation and research center"
    },
    {
      id: 14,
      name: "NSU Entrepreneurship Club",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "6.8K",
      mutualFriends: 29,
      skills: ["Entrepreneurship", "Business", "Startup"],
      location: "Dhaka",
      eventsOrganized: 43,
      rating: 4.6,
      memberCount: "400+",
      description: "Fostering entrepreneurial spirit"
    },
    {
      id: 15,
      name: "DU Cultural Society",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "9.3K",
      mutualFriends: 52,
      skills: ["Culture", "Arts", "Performance"],
      location: "Dhaka",
      eventsOrganized: 78,
      rating: 4.8,
      memberCount: "600+",
      description: "Promoting cultural activities and arts"
    },
    {
      id: 16,
      name: "AIUB Tech Community",
      role: "Organization",
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      followers: "7.4K",
      mutualFriends: 31,
      skills: ["Technology", "Programming", "Innovation"],
      location: "Dhaka",
      eventsOrganized: 55,
      rating: 4.7,
      memberCount: "450+",
      description: "Technology enthusiasts community"
    }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case "participants":
        return participants;
      case "organizers":
        return organizers;
      case "organizations":
        return organizations;
      default:
        return participants;
    }
  };

  const filteredData = getCurrentData().filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Connect with people</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover amazing people, organizers, and organizations. Connect with participants, organizers, and organizations to expand your network.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, skills, or organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <FiFilter className="text-sm" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiTrendingUp className="text-sm" />
              Trending
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveTab("participants")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "participants"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <FiUsers className="text-sm" />
            Participants ({participants.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("organizers")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "organizers"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <MdOutlineEmojiEvents className="text-sm" />
            Organizers ({organizers.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("organizations")}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "organizations"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <div className="flex items-center gap-2">
            <MdOutlineBusinessCenter className="text-sm" />
            Organizations ({organizations.length})
          </div>
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              {/* Profile Picture */}
              <img 
                src={item.avatar} 
                alt={item.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
              
              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.role === 'Student' 
                      ? 'bg-blue-100 text-blue-800' 
                      : item.role === 'Organizer'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {item.role}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{item.followers} followers</p>
                
                {/* Additional Info based on role */}
                {item.role === 'Student' && (
                  <div className="text-xs text-gray-500 mb-2">
                    <p>{item.university} • {item.department}</p>
                    <p>{item.eventsAttended} events attended • ⭐ {item.rating}</p>
                  </div>
                )}
                
                {item.role === 'Organizer' && (
                  <div className="text-xs text-gray-500 mb-2">
                    <p>{item.organization}</p>
                    <p>{item.eventsOrganized} events organized • ⭐ {item.rating}</p>
                    <p className="text-blue-600">{item.specialization}</p>
                  </div>
                )}
                
                {item.role === 'Organization' && (
                  <div className="text-xs text-gray-500 mb-2">
                    <p>{item.location} • {item.memberCount} members</p>
                    <p>{item.eventsOrganized} events organized • ⭐ {item.rating}</p>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                )}
                
                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {item.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      +{item.skills.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFollow(item.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      followedUsers.has(item.id)
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {followedUsers.has(item.id) ? (
                      <span className="flex items-center justify-center gap-2">
                        <FiCheckCircle className="text-sm" />
                        Following
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <FiPlus className="text-sm" />
                        Follow
                      </span>
                    )}
                  </button>
                  
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FiHeart className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Section */}
      {filteredData.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
            Load More Results
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <FiSearch className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters</p>
        </div>
      )}
    </div>
  );
};

export default Connect;


