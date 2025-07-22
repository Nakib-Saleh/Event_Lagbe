import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../../../Provider/AuthContext';
import axios from 'axios';

const OrganizerList = () => {
    const { user } = useContext(AuthContext);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <h2 className="text-2xl font-bold mb-4">Verified Organizers</h2>
            {organizers.length === 0 ? (
                <div className="text-gray-500 text-center">No verified organizers found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Name</th>
                                <th>Username</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {organizers.map(org => (
                                <tr key={org.id}>
                                    <td>
                                        <div className="avatar">
                                            <div className="w-12 h-12 rounded-full">
                                                <img
                                                    src={org.profilePictureUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                                                    alt={org.name}
                                                    onError={e => { e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp"; }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>{org.name}</td>
                                    <td>@{org.username}</td>
                                    <td>{org.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrganizerList;