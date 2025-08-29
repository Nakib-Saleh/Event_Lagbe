import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../Provider/AuthContext';
import axios from 'axios';

const OrganizerList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleOrganizerClick = (organizer) => {
        navigate(`/profile/${organizer.firebaseUid}`);
    };

    useEffect(() => {
        const fetchOrganizers = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:2038/api/organizer/${user.id}/verified-organizers`);
                setOrganizers(res.data);
            } catch {
                setOrganizers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizers();
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-32"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Verified Organizers</h2>
            {organizers.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400 text-center">No verified organizers found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b border-gray-200/50 dark:border-gray-700/50">
                                    <th className="text-gray-700 dark:text-gray-300 font-semibold bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm">Profile</th>
                                    <th className="text-gray-700 dark:text-gray-300 font-semibold bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm">Name</th>
                                    <th className="text-gray-700 dark:text-gray-300 font-semibold bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm">Username</th>
                                    <th className="text-gray-700 dark:text-gray-300 font-semibold bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizers.map(org => (
                                    <tr 
                                        key={org.id} 
                                        className="hover:bg-gray-50/80 dark:hover:bg-gray-700/80 cursor-pointer transition-all duration-200 border-b border-gray-100/50 dark:border-gray-600/50 last:border-b-0" 
                                        onClick={() => handleOrganizerClick(org)}
                                    >
                                        <td className="py-3">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-full ring-2 ring-gray-200/50 dark:ring-gray-600/50">
                                                    <img
                                                        src={org.profilePictureUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                                                        alt={org.name}
                                                        className="w-full h-full object-cover rounded-full"
                                                        onError={e => { e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp"; }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                                {org.name}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className="text-gray-600 dark:text-gray-400">@{org.username}</span>
                                        </td>
                                        <td className="py-3 text-gray-700 dark:text-gray-300">{org.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrganizerList;