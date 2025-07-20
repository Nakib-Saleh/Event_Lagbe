import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Verification = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);

  // Fetch unverified organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:2038/api/organizations/unverified");
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
      toast.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Handle approve organization
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:2038/api/organizations/${id}/approve`);
      toast.success("Organization approved successfully");
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error approving organization:", error);
      toast.error("Failed to approve organization");
    }
  };

  // Handle reject organization
  const handleReject = async (id) => {
    try {
      await axios.delete(`http://localhost:2038/api/organizations/${id}/reject`);

      toast.success("Organization rejected successfully");
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting organization:", error);
      toast.error("Failed to reject organization");
    }
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedOrganizations(organizations.map(org => org.id));
    } else {
      setSelectedOrganizations([]);
    }
  };

  // Handle select individual organization
  const handleSelectOrganization = (id) => {
    if (selectedOrganizations.includes(id)) {
      setSelectedOrganizations(selectedOrganizations.filter(orgId => orgId !== id));
    } else {
      setSelectedOrganizations([...selectedOrganizations, id]);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Organization Verification</h1>
      
      <div className="bg-white rounded-lg p-4 overflow-x-auto overflow-y-auto h-[calc(100vh-130px)]">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>
                  <label>
                    <input 
                      type="checkbox" 
                      className="checkbox" 
                      checked={selectedOrganizations.length === organizations.length && organizations.length > 0}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No unverified organizations found
                  </td>
                </tr>
              ) : (
                organizations.map((organization) => (
                  <tr key={organization.id}>
                    <th>
                      <label>
                        <input 
                          type="checkbox" 
                          className="checkbox" 
                          checked={selectedOrganizations.includes(organization.id)}
                          onChange={() => handleSelectOrganization(organization.id)}
                        />
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle h-12 w-12">
                            <img
                              src={organization.logoUrl || "https://img.daisyui.com/images/profile/demo/2@94.webp"}
                              alt={`${organization.name} logo`}
                              onError={(e) => {
                                e.target.src = "https://img.daisyui.com/images/profile/demo/2@94.webp";
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{organization.name}</div>
                          <div className="text-sm opacity-50">@{organization.username}</div>
                        </div>
                      </div>
                    </td>
                    <td>{organization.email}</td>
                    <td>{formatDate(organization.createdAt)}</td>
                    <th>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-success btn-xs"
                          onClick={() => handleApprove(organization.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-error btn-xs"
                          onClick={() => handleReject(organization.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </th>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Verification;
