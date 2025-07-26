import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart, FaCheckCircle, FaCrown } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";

const PublicProfile = () => {
  const { firebaseUid } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [organizers, setOrganizers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const getTabsForRole = (role) => {
    switch (role) {
      case "admin":
        return [{ id: "about", label: "About" }];
      case "organization":
        return [
          { id: "about", label: "About" },
          { id: "gallery", label: "Gallery" },
          { id: "organizers", label: "Organizers" },
          { id: "events", label: "Events" },
        ];
      case "organizer":
        return [
          { id: "about", label: "About" },
          { id: "gallery", label: "Gallery" },
          { id: "events", label: "Events" },
        ];
      case "participant":
        return [
          { id: "about", label: "About" },
          { id: "gallery", label: "Gallery" },
          { id: "followers", label: "Followers" },
          { id: "following", label: "Following" },
        ];
      default:
        return [{ id: "about", label: "About" }];
    }
  };

  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!firebaseUid) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // First, get the user's role and basic info
        const userResponse = await axios.get(
          `http://localhost:2038/api/auth/${firebaseUid}`
        );
        const { role, user } = userResponse.data;

        setUserRole(role);
        setProfileData(user);
        // Reset active tab to "about" when user role changes
        setActiveTab("about");
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [firebaseUid]);

  useEffect(() => {
    const fetchOrganizers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:2038/api/organizer/${profileData.id}/verified-organizers`
        );
        setOrganizers(res.data);
      } catch {
        setOrganizers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, [profileData]);

  const handleToggleFollow = () => {
    setIsFollowing((prev) => !prev);
    // TODO: Implement follow/unfollow API call
  };

  const getRoleBadge = (role, isVerified, isSuperAdmin) => {
    if (role === "admin" && isSuperAdmin) {
      return (
        <span className="badge badge-warning gap-1">
          <FaCrown className="text-xs" />
          Super Admin
        </span>
      );
    } else if (role === "admin") {
      return <span className="badge badge-info gap-1">Admin</span>;
    } else if (role === "organization" && isVerified) {
      return (
        <span className="badge badge-success gap-1">
          <FaCheckCircle className="text-xs" />
          Verified Organization
        </span>
      );
    } else if (role === "organization") {
      return <span className="badge badge-warning gap-1">Organization</span>;
    } else if (role === "organizer" && isVerified) {
      return (
        <span className="badge badge-success gap-1">
          <FaCheckCircle className="text-xs" />
          Verified Organizer
        </span>
      );
    } else if (role === "organizer") {
      return <span className="badge badge-warning gap-1">Organizer</span>;
    } else if (role === "participant") {
      return <span className="badge badge-primary gap-1">Participant</span>;
    }
    return null;
  };

  const getRoleSpecificFields = () => {
    if (!profileData) return [];

    const fields = [
      { label: "Email", value: profileData.email, readonly: true },
      { label: "Name", value: profileData.name },
      { label: "Username", value: profileData.username },
    ];

    // Add role-specific fields
    if (userRole === "organization" || userRole === "organizer") {
      fields.push({ label: "Type", value: profileData.type });
    }

    if (userRole === "organization") {
      fields.push({
        label: "Events Created",
        value: profileData.eventIds?.length || 0,
      });
      fields.push({
        label: "Organizers",
        value: profileData.organizerIds?.length || 0,
      });
    }

    if (userRole === "organizer") {
      fields.push({ label: "Organization", value: profileData.organizationId });
    }

    return fields;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">
          {error || "Profile not found"}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      {/* Banner */}
      <div className="relative h-60 bg-gray-200 rounded-lg shadow-sm">
        <img
          src={
            profileData.bannerUrl ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"
          }
          alt="Cover"
          className="object-cover w-full h-full rounded-lg"
        />

        {/* Profile Picture */}
        <div className="absolute -bottom-14 left-6 z-50 flex items-end">
          <div className="relative w-28 h-28 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src={
                profileData.profilePictureUrl ||
                "https://img.daisyui.com/images/profile/demo/2@94.webp"
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://img.daisyui.com/images/profile/demo/2@94.webp";
              }}
            />
            {profileData.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
            )}
            {userRole === "admin" && profileData.isSuperAdmin && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <FaCrown className="text-yellow-600 text-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name + Username + Follow */}
      <div className="pt-20 px-6 sm:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name || profileData.username}
              </h2>
              {getRoleBadge(
                userRole,
                profileData.isVerified,
                profileData.isSuperAdmin
              )}
            </div>
            <p className="text-gray-500">
              @{profileData.username || "unknown"}
            </p>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{profileData.followers?.length || 0} Followers</span>
              <span>{profileData.following?.length || 0} Following</span>
              {userRole === "organization" && (
                <>
                  <span>{profileData.eventIds?.length || 0} Events</span>
                  <span>
                    {profileData.organizerIds?.length || 0} Organizers
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleToggleFollow}
              className={`btn flex items-center gap-2 transition duration-200 ${
                !isFollowing
                  ? "bg-gray-200 text-black"
                  : "bg-red-600 text-white"
              }`}
            >
              {!isFollowing ? (
                <CiHeart className="text-xl" />
              ) : (
                <FaHeart className="text-xl" />
              )}
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        </div>
      </div>

      <div className="border-b-2 border-gray-400 w-full my-4"></div>

      <div role="tablist" className="tabs tabs-boxed gap-x-6">
        {getTabsForRole(userRole).map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-center font-bold px-2 pt-2 pb-0 transition border-b-2 cursor-pointer
              ${
                activeTab === tab.id
                  ? "text-red-500 border-red-500"
                  : "text-black border-transparent"
              } rounded-t-xl`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* About Tab */}
      {activeTab === "about" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="space-y-4">
            {getRoleSpecificFields().map((field, index) => (
              <div key={index} className="form-control">
                <label className="label">
                  <span className="label-text font-medium">{field.label}</span>
                </label>
                <p className="text-gray-700">{field.value || "Not provided"}</p>
              </div>
            ))}

            {/* Created / Updated Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text">Created At</span>
                </label>
                <p className="text-sm text-gray-500">
                  {profileData.createdAt
                    ? new Date(profileData.createdAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Last Updated</span>
                </label>
                <p className="text-sm text-gray-500">
                  {profileData.updatedAt
                    ? new Date(profileData.updatedAt).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Tab */}
      {activeTab === "gallery" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Gallery</h3>
          {profileData.pictureUrls && profileData.pictureUrls.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profileData.pictureUrls.map((url, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x300?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No gallery images yet
            </p>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Events ({profileData.eventIds?.length || 0})
          </h3>
          {profileData.eventIds && profileData.eventIds.length > 0 ? (
            <div className="space-y-2">
              {profileData.eventIds.map((eventId, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <span className="font-medium">Event ID: {eventId}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No events created yet
            </p>
          )}
        </div>
      )}

      {/* Organizers Tab - Only for organizations */}
      {activeTab === "organizers" && userRole === "organization" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizers.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-2">
                  No verified organizers found.
                </p>
                <p className="text-sm text-gray-400">
                  Only verified organizers are displayed here.
                </p>
              </div>
            ) : (
              organizers.map((org) => (
                <div
                  key={org.id}
                  className="p-4 border rounded shadow-sm flex items-center gap-4"
                >
                  <div className="relative">
                    <img
                      src={org.profilePictureUrl}
                      alt={org.name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://img.daisyui.com/images/profile/demo/2@94.webp";
                      }}
                    />
                    {org.isVerified && (
                      <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1">
                        <FaCheckCircle className="text-green-600 text-xs" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{org.name}</h3>
                    <p className="text-sm text-gray-500">@{org.username}</p>
                    {org.isVerified && (
                      <span className="text-xs text-green-600 font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Followers Tab */}
      {activeTab === "followers" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Followers ({profileData.followers?.length || 0})
          </h3>
          {profileData.followers && profileData.followers.length > 0 ? (
            <div className="space-y-2">
              {profileData.followers.map((follower, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">{follower}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No followers yet</p>
          )}
        </div>
      )}

      {/* Following Tab */}
      {activeTab === "following" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Following ({profileData.following?.length || 0})
          </h3>
          {profileData.following && profileData.following.length > 0 ? (
            <div className="space-y-2">
              {profileData.following.map((following, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">{following}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              Not following anyone yet
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
