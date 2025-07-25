import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../Provider/AuthContext";
import axios from "axios";

const Eventlist = () => {
    const { user } = useContext(AuthContext);
    const [organizers, setOrganizers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');

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
        <div>
            {/* Toggle Buttons Grid */}
            <div className="grid grid-cols-5 gap-4 mb-6">
                <button
                    className={`btn ${selectedTab === 'all' ? 'bg-red-500 text-white' : 'btn-outline'}`}
                    onClick={() => setSelectedTab('all')}
                >
                    All Events
                </button>
                {organizers.map((org) => (
                    <button
                        key={org.id || org._id || org.name}
                        className={`btn ${selectedTab === org.id ? 'bg-red-500 text-white' : 'btn-outline'}`}
                        onClick={() => setSelectedTab(org.id)}
                    >
                        {org.name}
                    </button>
                ))}
            </div>
            Eventlist
        </div>
    )
}

export default Eventlist