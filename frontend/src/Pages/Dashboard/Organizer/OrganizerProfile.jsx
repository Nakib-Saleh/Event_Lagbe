import axios from 'axios';
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../../Provider/AuthContext";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { debounce } from 'lodash';

const OrganizerProfile = () => {
  const { user, userRole } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowing(prev => !prev);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:2038/api/auth/${userRole}/${user.firebaseUid}`);
        setProfileData(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile data");
      } finally {
        setLoading(false);
      }
    };

    if (user?.firebaseUid && userRole) {
      fetchProfile();
    }
  }, [user.firebaseUid, userRole]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear username error when user starts typing
    if (name === 'username') {
      setUsernameError("");
    }
  };

  // Debounced username check
  const checkUsernameAvailability = debounce(async (username) => {
    if (!username || username === profileData?.username) {
      setUsernameError("");
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await axios.get(`http://localhost:2038/api/auth/check-username/${username}`);
      if (response.data.exists) {
        setUsernameError("Username already taken");
      } else {
        setUsernameError("");
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameError("Error checking username availability");
    } finally {
      setIsCheckingUsername(false);
    }
  }, 500);

  const handleUsernameChange = (e) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      username: value
    }));
    setUsernameError("");
    checkUsernameAvailability(value);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: res.secure_url,
      }));
      toast.success("Profile picture updated (not saved yet)");
    } catch {
      toast.error("Failed to upload profile picture");
    }
  };

  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        bannerUrl: res.secure_url,
      }));
      toast.success("Banner updated (not saved yet)");
    } catch {
      toast.error("Failed to upload banner");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if there's a username error
    if (usernameError) {
      toast.error("Please fix the username error before saving");
      return;
    }

    try {
      await axios.put(`http://localhost:2038/api/auth/${userRole}/${user.firebaseUid}`, formData);
      setProfileData(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-600">Profile not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-6">
      {/* Banner */}
      <div className="relative h-60 bg-gray-200 rounded-lg shadow-sm">
        <img
          src={formData.bannerUrl || profileData.bannerUrl || "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1350&q=80"}
          alt="Cover"
          className="object-cover w-full h-full rounded-lg"
        />
        {isEditing && (
          <div className="absolute top-4 right-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="file-input file-input-bordered file-input-sm bg-white/80 backdrop-blur-sm"
            />
          </div>
        )}
        {/* Profile Picture */}
        <div className="absolute -bottom-14 left-6 z-50 flex items-end">
          <div className="relative w-28 h-28 border-4 border-white rounded-full overflow-hidden shadow-lg">
            <img
              src={formData.profilePictureUrl || profileData.profilePictureUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp";
              }}
            />
            {profileData.isVerified && (
              <div className="absolute -top-1 -right-1 bg-green-400 rounded-full p-1">
                <FaCheckCircle className="text-green-600 text-sm" />
              </div>
            )}
          </div>
          {isEditing && (
            <div className="ml-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="file-input file-input-bordered file-input-sm mt-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* Name + Username + Edit */}
      <div className="pt-20 px-6 sm:px-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name || profileData.username}
              </h2>
              {profileData.isVerified && (
                <span className="badge badge-success gap-1">
                  <FaCheckCircle className="text-xs" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-500">@{profileData.username || "unknown"}</p>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{profileData.followers?.length || 0} Followers</span>
              <span>{profileData.following?.length || 0} Following</span>
              <span>{profileData.eventIds?.length || 0} Events</span>
            </div>
          </div>
          <div className='flex gap-4'>
            <button onClick={handleToggleFollow}
              className={`btn flex items-center gap-2 transition duration-200 ${
              !isFollowing ? "bg-gray-200 text-black" : "bg-red-600 text-white"
              }`}
            >
              {!isFollowing ? (
                <CiHeart className="text-xl" />
              ) : (
                <FaHeart className="text-xl" />
              )}
              {isFollowing ? "Following" : "Follow"}
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn bg-blue-600 text-white"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>

      <div className='border-b-2 border-gray-400 w-full my-4'></div>
            
      {/* About Section */}
      <div className="bg-white mt-6 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">About</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <p className="text-gray-700">{profileData.email}</p>
          </div>

          {/* Name (editable) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Name</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                className="input input-bordered"
                placeholder="Enter your name"
              />
            ) : (
              <p className="text-gray-700">{profileData.name || 'Not provided'}</p>
            )}
          </div>

          {/* Username (editable with validation) */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Username</span>
            </label>
            {isEditing ? (
              <div>
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleUsernameChange}
                  className={`input input-bordered ${usernameError ? 'input-error' : ''}`}
                  placeholder="Enter username"
                />
                {isCheckingUsername && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="loading loading-spinner loading-xs"></span>
                    <span className="text-sm text-gray-500">Checking username availability...</span>
                  </div>
                )}
                {usernameError && (
                  <p className="text-error text-sm mt-1">{usernameError}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-700">{profileData.username || 'Not provided'}</p>
            )}
          </div>

          {/* Organization ID */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Organization ID</span>
            </label>
            <p className="text-gray-700">{profileData.organizationId || 'Not assigned'}</p>
          </div>

          {/* Verification Status */}
          <div className="form-control flex flex-col gap-2">
            <label className="label">
              <span className="label-text font-medium">Verification Status</span>
            </label>
            <span className={`badge ${profileData.isVerified ? 'badge-success' : 'badge-warning'}`}>
              {profileData.isVerified ? 'Verified' : 'Pending Verification'}
            </span>
          </div>

          {/* Created At */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Member Since</span>
            </label>
            <p className="text-gray-700">
              {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'Unknown'}
            </p>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!!usernameError || isCheckingUsername}
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OrganizerProfile;
