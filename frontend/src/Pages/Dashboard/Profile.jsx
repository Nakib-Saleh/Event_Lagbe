import axios from 'axios';
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../../Provider/AuthContext";
import { toast } from "react-hot-toast";

const Profile = () => {
    const { user, userRole } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:2038/api/auth/${userRole}/${user.uid}`);
                setProfileData(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast.error("Failed to fetch profile data");
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.uid && userRole) {
            fetchProfile();
        }
    }, [user?.uid, userRole]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:2038/api/auth/${userRole}/${user.uid}`, formData);
            setProfileData(formData);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData(profileData);
        setIsEditing(false);
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
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {userRole === 'admin' ? 'Admin' : 
                                 userRole === 'organization' ? 'Organization' : 
                                 userRole === 'organizer' ? 'Organizer' : 
                                 userRole === 'participant' ? 'Participant' : 'User'} Profile
                            </h1>
                            <p className="text-gray-600 mt-1">Manage your account information</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="btn bg-red-500 text-white btn-sm"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </div>

                {/* Profile Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Picture */}
                            <div className="md:col-span-2">
                                <div className="flex items-center space-x-4">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full">
                                            <img
                                                src={profileData.logoUrl || profileData.profilePicture || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                                                alt="Profile"
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp";
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold">{profileData.name || profileData.username}</h3>
                                        <p className="text-gray-600">{profileData.email}</p>
                                        <p className="text-sm text-gray-500">Member since {new Date(profileData.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                                
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

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Email</span>
                                    </label>
                                    <p className="text-gray-700">{profileData.email}</p>
                                </div>

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
                                            placeholder="Enter username"
                                        />
                                    ) : (
                                        <p className="text-gray-700">{profileData.username || 'Not provided'}</p>
                                    )}
                                </div>

                                {/* Organization/Company specific fields */}
                                {(userRole === 'organization' || userRole === 'organizer') && (
                                    <>
                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Type</span>
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

                                        <div className="form-control">
                                            <label className="label">
                                                <span className="label-text font-medium">Verification Status</span>
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                <span className={`badge ${profileData.isVerified ? 'badge-success' : 'badge-warning'}`}>
                                                    {profileData.isVerified ? 'Verified' : 'Pending Verification'}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Additional Information</h3>
                                
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Account Created</span>
                                    </label>
                                    <p className="text-gray-700">{new Date(profileData.createdAt).toLocaleString()}</p>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Last Updated</span>
                                    </label>
                                    <p className="text-gray-700">{new Date(profileData.updatedAt).toLocaleString()}</p>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-medium">Firebase UID</span>
                                    </label>
                                    <p className="text-gray-500 text-sm font-mono">{profileData.firebaseUid}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isEditing && (
                            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;