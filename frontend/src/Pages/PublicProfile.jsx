// PublicProfile.jsx
import axios from "axios";
import React, { useEffect, useMemo, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaCrown, FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { toast } from "react-hot-toast";

// Auth
import AuthContext from "../Provider/AuthContext";

// Role components
import ParticipantPublic from "../AllProfiles/ParticipantPublic";
import OrganizerPublic from "../AllProfiles/OrganizerPublic";
import OrganizationPublic from "../AllProfiles/OrganizationPublic";

const PublicProfile = () => {
  const { firebaseUid } = useParams();
  const { user: authUser, userRole } = useContext(AuthContext);

  const [userRoleOfProfile, setUserRoleOfProfile] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  // Load public profile + role
  useEffect(() => {
    const load = async () => {
      if (!firebaseUid) {
        setError("Invalid user ID");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:2038/api/auth/${firebaseUid}`
        );
        setUserRoleOfProfile(data.role);
        setProfileData(data.user);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Profile not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [firebaseUid]);

  // Following state = does *my* following contain *their* uid?
  useEffect(() => {
    if (!authUser || !profileData) {
      setIsFollowing(false);
      return;
    }
    const myFollowing = Array.isArray(authUser.following)
      ? authUser.following
      : [];
    setIsFollowing(myFollowing.includes(profileData.firebaseUid));
  }, [authUser, profileData]);

  const isOwnProfile =
    authUser?.firebaseUid &&
    profileData?.firebaseUid &&
    authUser.firebaseUid === profileData.firebaseUid;

  const roleBadge = useMemo(() => {
    if (!userRoleOfProfile) return null;
    if (userRoleOfProfile === "admin" && profileData?.isSuperAdmin)
      return (
        <span className="badge badge-warning gap-1">
          <FaCrown className="text-xs" />
          Super Admin
        </span>
      );
    if (userRoleOfProfile === "admin") return <span className="badge">Admin</span>;
    if (userRoleOfProfile === "organization" && profileData?.isVerified)
      return (
        <span className="badge badge-success gap-1">
          <FaCheckCircle className="text-xs" />
          Verified Organization
        </span>
      );
    if (userRoleOfProfile === "organizer" && profileData?.isVerified)
      return (
        <span className="badge badge-success gap-1">
          <FaCheckCircle className="text-xs" />
          Verified Organizer
        </span>
      );
    if (userRoleOfProfile === "organization")
      return <span className="badge badge-outline">Organization</span>;
    if (userRoleOfProfile === "organizer")
      return <span className="badge badge-outline">Organizer</span>;
    if (userRoleOfProfile === "participant")
      return <span className="badge badge-primary">Participant</span>;
    return null;
  }, [userRoleOfProfile, profileData]);

  // Follow/Unfollow exactly like Connect.jsx, but status comes only from *my* following list
  const handleFollow = async (userId, firebaseUid) => {
    // Don't allow users to follow themselves
    if (firebaseUid === authUser?.firebaseUid) {
      return;
    }

    if (!authUser?.firebaseUid || !userRole) {
      toast.error("Please log in to follow users");
      return;
    }

    try {
      const isCurrentlyFollowing = isFollowing;
      
      // Use the common follow endpoint
      const apiEndpoint = `http://localhost:2038/api/follow/${authUser.firebaseUid}/follow/${firebaseUid}`;
      
      if (isCurrentlyFollowing) {
        // Unfollow user
        await axios.delete(apiEndpoint);
        setIsFollowing(false);
        toast.success("Unfollowed successfully");
      } else {
        // Follow user
        await axios.post(apiEndpoint);
        setIsFollowing(true);
        toast.success("Followed successfully");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
      const errorMessage = error.response?.data || "Failed to follow/unfollow user";
      toast.error(errorMessage);
    }
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
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-600">
          {error || "Profile not found"}
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Banner */}
      <div className="relative h-60 bg-base-200 rounded-xl ">
        <img
          src={
            profileData.bannerUrl ||
            "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"
          }
          alt="cover"
          className="w-full h-full object-cover"
        />

        {/* Avatar */}
        <div className="absolute -bottom-14 left-6">
          <div className="relative w-28 h-28 rounded-full ring-4 ring-white  shadow-xl">
            <img
              src={
                profileData.profilePictureUrl ||
                "https://img.daisyui.com/images/profile/demo/2@94.webp"
              }
              onError={(e) => {
                e.currentTarget.src =
                  "https://img.daisyui.com/images/profile/demo/2@94.webp";
              }}
              alt="avatar"
              className="w-full h-full object-cover"
            />
            {profileData.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1">
                <FaCheckCircle className="text-green-700 text-xs" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Header row */}
      <div className="pt-20 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {profileData.name || profileData.username}
              </h1>
              {roleBadge}
            </div>
            <p className="text-base-content/60">@{profileData.username}</p>
          </div>

          <div>{!isOwnProfile && (
           <button
           onClick={() => handleFollow(profileData.id, profileData.firebaseUid)}
           className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
             isFollowing || profileData.firebaseUid === authUser?.firebaseUid
               ? 'btn btn-primary  bg-red-400 text-white hover:bg-red-500'
               : 'btn btn-primary  bg-gray-200 text-black hover:bg-gray-700'
           }`}
           disabled={profileData.firebaseUid === authUser?.firebaseUid}
         >
           {isFollowing || profileData.firebaseUid === authUser?.firebaseUid ? (
             <span className="flex items-center justify-center gap-2">
               <FaHeart className="text-sm" />
               Following
             </span>
           ) : (
             <span className="flex items-center justify-center gap-2">
               <CiHeart className="text-sm" />
               Follow
             </span>
           )}
         </button> 
          )}</div>
        </div>
      </div>

      {/* Role-render */}
      <div className="px-6 mt-6">
        {userRoleOfProfile === "participant" && (
          <ParticipantPublic profile={profileData} />
        )}
        {userRoleOfProfile === "organizer" && <OrganizerPublic profile={profileData} />}
        {userRoleOfProfile === "organization" && (
          <OrganizationPublic profile={profileData} />
        )}

        {/* Fallback for unknown roles */}
        {!["participant", "organizer", "organization"].includes(userRoleOfProfile) && (
          <div className="card bg-base-100 shadow mt-4">
            <div className="card-body">
              <h3 className="card-title">About</h3>
              <p>Email: {profileData.email}</p>
              {profileData.createdAt && (
                <p>Created: {new Date(profileData.createdAt).toLocaleString()}</p>
              )}
              {profileData.updatedAt && (
                <p>Updated: {new Date(profileData.updatedAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
