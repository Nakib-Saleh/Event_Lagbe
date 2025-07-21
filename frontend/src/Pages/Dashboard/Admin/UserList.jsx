import React, { useState } from 'react';

const UserList = () => {

    const TABS = [
        { id: "Organization", label: "Organizations" },
        { id: "Organizer", label: "Organizers" },
        { id: "Participant", label: "Participants" },
      ];

    const [activeTab, setActiveTab] = useState("Organization");
    return (
        <div>
            <div role="tablist" className="tabs tabs-boxed gap-x-4">
        {TABS.map(tab => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab ${activeTab === tab.id ? "tab-active" : ""} text-center font-bold px-2 py-2 rounded-xl border-2 border-black transition ${activeTab === tab.id ? "bg-red-500 text-white" : "bg-blue-200 text-black"}`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-center py-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{activeTab}s</h1>
        </div>
        </div>
    );
};

export default UserList;