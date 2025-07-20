import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Verification = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrganizations, setSelectedOrganizations] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false);

  // Fetch unverified organizations
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:2038/api/organization/unverified");
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

  // Show approve confirmation modal
  const showApproveConfirmation = (organization) => {
    setSelectedOrganization(organization);
    setShowApproveModal(true);
  };

  // Show reject confirmation modal
  const showRejectConfirmation = (organization) => {
    setSelectedOrganization(organization);
    setShowRejectModal(true);
  };

  // Handle approve organization
  const handleApprove = async () => {
    try {
      await axios.put(`http://localhost:2038/api/organization/${selectedOrganization.id}/approve`);
      toast.success("Organization approved successfully");
      setShowApproveModal(false);
      setSelectedOrganization(null);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error approving organization:", error);
      toast.error("Failed to approve organization");
    }
  };

  // Handle reject organization
  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:2038/api/organization/${selectedOrganization.id}/reject`);
      toast.success("Organization rejected successfully");
      setShowRejectModal(false);
      setSelectedOrganization(null);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting organization:", error);
      toast.error("Failed to reject organization");
    }
  };

  // Show bulk approve confirmation modal
  const showBulkApproveConfirmation = () => {
    if (selectedOrganizations.length === 0) {
      toast.error("Please select organizations to approve");
      return;
    }
    setShowBulkApproveModal(true);
  };

  // Show bulk reject confirmation modal
  const showBulkRejectConfirmation = () => {
    if (selectedOrganizations.length === 0) {
      toast.error("Please select organizations to reject");
      return;
    }
    setShowBulkRejectModal(true);
  };

  // Handle bulk approve organizations
  const handleBulkApprove = async () => {
    try {
      const promises = selectedOrganizations.map(id => 
        axios.put(`http://localhost:2038/api/organization/${id}/approve`)
      );
      await Promise.all(promises);
      toast.success(`${selectedOrganizations.length} organizations approved successfully`);
      setShowBulkApproveModal(false);
      setSelectedOrganizations([]);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error approving organizations:", error);
      toast.error("Failed to approve some organizations");
    }
  };

  // Handle bulk reject organizations
  const handleBulkReject = async () => {
    try {
      const promises = selectedOrganizations.map(id => 
        axios.delete(`http://localhost:2038/api/organization/${id}/reject`)
      );
      await Promise.all(promises);
      toast.success(`${selectedOrganizations.length} organizations rejected successfully`);
      setShowBulkRejectModal(false);
      setSelectedOrganizations([]);
      fetchOrganizations(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting organizations:", error);
      toast.error("Failed to reject some organizations");
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
      
      {/* Bulk Action Buttons */}
      {selectedOrganizations.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-800">
                {selectedOrganizations.length} organization(s) selected
              </span>
            </div>
            <div className="flex gap-2">
              <button 
                className="btn btn-success btn-sm"
                onClick={showBulkApproveConfirmation}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Selected
              </button>
              <button 
                className="btn btn-error btn-sm"
                onClick={showBulkRejectConfirmation}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject Selected
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg p-4 overflow-x-auto overflow-y-auto max-h-[calc(100vh-130px)]">
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
                          onClick={() => showApproveConfirmation(organization)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-error btn-xs"
                          onClick={() => showRejectConfirmation(organization)}
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

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-green-600">Confirm Approval</h3>
            <p className="py-4">
              Are you sure you want to approve <strong>{selectedOrganization?.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This will allow the organization to access the platform and create events.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowApproveModal(false);
                  setSelectedOrganization(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleApprove}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600">Confirm Rejection</h3>
            <p className="py-4">
              Are you sure you want to reject <strong>{selectedOrganization?.name}</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This action will permanently delete the organization and their Firebase account. This action cannot be undone.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedOrganization(null);
                }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={handleReject}
              >
                Reject & Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Approve Confirmation Modal */}
      {showBulkApproveModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-green-600">Confirm Bulk Approval</h3>
            <p className="py-4">
              Are you sure you want to approve <strong>{selectedOrganizations.length} organization(s)</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This will allow all selected organizations to access the platform and create events.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => setShowBulkApproveModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-success"
                onClick={handleBulkApprove}
              >
                Approve All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Reject Confirmation Modal */}
      {showBulkRejectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600">Confirm Bulk Rejection</h3>
            <p className="py-4">
              Are you sure you want to reject <strong>{selectedOrganizations.length} organization(s)</strong>?
            </p>
            <p className="text-sm text-gray-600 mb-4">
              This action will permanently delete all selected organizations and their Firebase accounts. This action cannot be undone.
            </p>
            <div className="modal-action">
              <button 
                className="btn btn-outline"
                onClick={() => setShowBulkRejectModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-error"
                onClick={handleBulkReject}
              >
                Reject & Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verification;
