import axios from 'axios';
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../../Provider/AuthContext";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaCrown } from "react-icons/fa";

const AdminProfile = () => {
  const TABS = [
    { id: "about", label: "About" },
    { id: "followers", label: "Followers" },
    { id: "following", label: "Following" },
  ];

  const { user, userRole } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [pages, setPages] = useState("about");

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
          className="object-cover h-full w-full rounded-lg"
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
            {profileData.isSuperAdmin && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <FaCrown className="text-yellow-600 text-sm" />
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {profileData.name || profileData.username}
              </h2>
              {profileData.isSuperAdmin && (
                <span className="badge badge-warning gap-1">
                  <FaCrown className="text-xs" />
                  Super Admin
                </span>
              )}
            </div>
            <p className="text-gray-500">@{profileData.username || "unknown"}</p>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{profileData.followers?.length || 0} Followers</span>
              <span>{profileData.following?.length || 0} Following</span>
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
            
      <div role="tablist" className="tabs tabs-boxed gap-x-6">
        {TABS.map(tab => (
          <div key={tab.id}
            onClick={() => setPages(tab.id)}
            className={`text-center font-bold px-2 pt-2 pb-0 transition border-b-2 cursor-pointer
              ${pages === tab.id ? "text-red-500 border-red-500" : "text-black border-transparent"} rounded-t-xl`}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {pages === "about" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
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
                />
              ) : (
                <p className="text-gray-700">{profileData.name || 'Not provided'}</p>
              )}
            </div>

            {/* Username (editable) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Username</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="username"
                  value={formData.username || ''}
                  onChange={handleInputChange}
                  className="input input-bordered"
                />
              ) : (
                <p className="text-gray-700">{profileData.username || 'Not provided'}</p>
              )}
            </div>

            {/* Admin Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Admin Type</span>
              </label>
              <p className="text-gray-700">
                {profileData.isSuperAdmin ? 'Super Admin' : 'Regular Admin'}
              </p>
            </div>


            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            )}
          </form>
        </div>
      )}

      {pages === "followers" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Followers ({profileData.followers?.length || 0})</h3>
          {profileData.followers && profileData.followers.length > 0 ? (
            <div className="space-y-2">
              {profileData.followers.map((follower, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
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

      {pages === "following" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Following ({profileData.following?.length || 0})</h3>
          {profileData.following && profileData.following.length > 0 ? (
            <div className="space-y-2">
              {profileData.following.map((following, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <span className="font-medium">{following}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Not following anyone yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
