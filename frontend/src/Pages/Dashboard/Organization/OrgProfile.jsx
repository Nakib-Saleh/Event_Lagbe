import axios from 'axios';
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../../Provider/AuthContext";
import { toast } from "react-hot-toast";
import { uploadToCloudinary } from "../../../utils/cloudinaryUpload";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";

const Profile = () => {
  const TABS = [
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "events", label: "Events" },
    { id: "organizers", label: "Organizers" },
    { id: "followers", label: "Followers" },
    { id: "following", label: "Following" },
  ];

  const { user, userRole } = useContext(AuthContext);
  const [organizers, setOrganizers] = useState([]);
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
    const fetchOrganizers = async () => {
      if (!profileData?.id) return;
      
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:2038/api/organizer/${profileData.id}/verified-organizers`);
        setOrganizers(res.data);
      } catch (error) {
        console.error("Error fetching verified organizers:", error);
        setOrganizers([]);
      } finally {
        setLoading(false);
      }
    };
    
    if (profileData?.id) {
      fetchOrganizers();
    }
  }, [profileData?.id]);

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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    try {
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.secure_url);
      
      setFormData((prev) => ({
        ...prev,
        pictureUrls: [...(prev.pictureUrls || []), ...newUrls],
      }));
      toast.success(`${files.length} image(s) added to gallery (not saved yet)`);
    } catch {
      toast.error("Failed to upload gallery images");
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      pictureUrls: prev.pictureUrls?.filter((_, index) => index !== indexToRemove) || [],
    }));
    toast.success("Image removed from gallery (not saved yet)");
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
              <span>{organizers?.length || 0} Organizers</span>
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

            {/* Organization Type */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Organization Type</span>
              </label>
              {isEditing ? (
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleInputChange}
                  className="select select-bordered"
                >
                  <option value="">Select type</option>
                  <option value="corporate">Corporate</option>
                  <option value="non-profit">Non-Profit</option>
                  <option value="educational">Educational</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-700">{profileData.type || 'Not specified'}</p>
              )}
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

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            )}
          </form>
        </div>
      )}

      {pages === "gallery" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Gallery</h3>
            {isEditing && formData.pictureUrls && formData.pictureUrls.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                    className="hidden"
                  />
                  <div className="btn btn-sm btn-outline">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    Add Images
                  </div>
                </label>
              </div>
            )}
          </div>
          
          {(formData.pictureUrls || profileData.pictureUrls) && (formData.pictureUrls || profileData.pictureUrls).length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(formData.pictureUrls || profileData.pictureUrls).map((url, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                  <img
                    src={url}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x300?text=Image+Not+Found";
                    }}
                  />
                  {isEditing &&  (
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        onClick={() => removeGalleryImage(index)}
                        className="btn btn-sm btn-error text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No gallery images yet</p>
              {isEditing && (
                <p className="text-sm text-gray-400">Use the upload button above to add images to your gallery</p>
              )}
            </div>
          )}

          {/* Modern Upload Area - Only show in edit mode when no images exist */}
          {isEditing && (!formData.pictureUrls || formData.pictureUrls.length === 0) && (
            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upload Section */}
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors duration-200">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Upload Icon */}
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                    </div>
                    
                    {/* Upload Text */}
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">Upload Gallery Images</h4>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG and GIF files are allowed</p>
                      
                      {/* Custom Upload Button */}
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryUpload}
                          className="hidden"
                        />
                        <div className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                          Choose Files
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Complete Your Gallery</h4>
                  <p className="text-gray-600 mb-4">
                    Showcase your organization's events, activities, and achievements with a beautiful gallery. 
                    Upload multiple images to create an engaging visual portfolio.
                  </p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Upload multiple images at once
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Supports PNG, JPG, and GIF formats
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Automatic image optimization
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gallery Save Button - Show when in edit mode and there are gallery changes */}
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Save Gallery Changes
              </button>
            </div>
          )}
        </div>
      )}

      {pages === "events" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Events ({profileData.eventIds?.length || 0})</h3>
          {profileData.eventIds && profileData.eventIds.length > 0 ? (
            <div className="space-y-2">
              {profileData.eventIds.map((eventId, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold">{index + 1}</span>
                  </div>
                  <span className="font-medium">Event ID: {eventId}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No events created yet</p>
          )}
        </div>
      )}

      {pages === "organizers" && (
        <div className="bg-white mt-6 p-6 rounded-lg shadow">
          <div className="flex items-center gap-2 mb-4">
            <h2 className='text-2xl font-bold text-gray-800'>Verified Organizers</h2>
            <span className="badge badge-success gap-1">
              <FaCheckCircle className="text-xs" />
              {organizers.length} Verified
            </span>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {organizers.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 mb-2">No verified organizers found.</p>
                <p className="text-sm text-gray-400">Only verified organizers are displayed here.</p>
              </div>
            ) : (
              organizers.map(org => (
                <div key={org.id} className="p-4 border rounded shadow-sm flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={org.profilePictureUrl} 
                      alt={org.name} 
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp";
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
                      <span className="text-xs text-green-600 font-medium">Verified</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
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

export default Profile;
