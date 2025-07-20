import React, { useState, useContext } from "react";
import AuthContext from "../Provider/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import animationData from "../assets/ladylog.json";

const Register = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    idDocuments: [], // array of File objects
    idDocumentUrls: [], // array of Cloudinary URLs
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { registerWithFirebaseAndMongo } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      idDocuments: [...prev.idDocuments, ...files],
    }));
  };

  const handleRemoveDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      idDocuments: prev.idDocuments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
  
    let idDocumentUrls = [];
  
    if (userType === "participant") {
      if (!formData.idDocuments.length) {
        toast.error("ID documents are required for participants");
        setIsLoading(false);
        return;
      }
  
      try {
        // Upload each document
        const uploadPromises = formData.idDocuments.map(file => uploadToCloudinary(file));
        const uploadResults = await Promise.all(uploadPromises);
        idDocumentUrls = uploadResults.map(res => res.secure_url);
      } catch (error) {
        toast.error("Failed to upload ID documents. Please try again.");
        console.error(error);
        setIsLoading(false);
        return;
      }
    }
  
    // Prepare final formData to send
    const submissionData = {
      ...formData,
      idDocumentUrls, // Only for participant
    };
    console.log(submissionData);
  
    try {
      const result = await registerWithFirebaseAndMongo(userType, submissionData);
  
      if (result.success) {
        toast.success("Registration successful");
        setFormData({
          name: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          idDocuments: [],
          idDocumentUrls: [],
        });
        
        
        setUserType("");
        navigate("/");
        window.location.reload();
      } else {
        toast.error("Registration failed.");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const renderForm = () => {
    const baseFields = (
      <>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Full Name</span>
          </label>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Username</span>
          </label>
          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Email</span>
          </label>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="input input-bordered w-full"
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Password</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password"
              className="input input-bordered w-full pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Confirm Password</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm password"
              className="input input-bordered w-full pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </>
    );

    if (userType === "participant") {
      return (
        <>
          {baseFields}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-bold">ID Documents</span>
            </label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              multiple
              required
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Upload your ID documents (JPG, PNG)
              </span>
            </label>
            {formData.idDocuments && formData.idDocuments.length > 0 && (
              <div className="mt-2 p-2 bg-base-200 rounded-lg">
                <ul className="text-sm space-y-2">
                  {formData.idDocuments.map((file, idx) => (
                    <li key={idx} className="flex items-center bg-base-300 rounded-lg p-2 justify-between">
                      {file.name}
                      <button
                        type="button"
                        className="btn btn-xs btn-error"
                        onClick={() => handleRemoveDocument(idx)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      );
    }
    return baseFields;
  };

  const getUserTypeColor = (type) => {
    const colors = {
      admin: "badge-error",
      organization: "badge-primary",
      organizer: "badge-success",
      participant: "badge-secondary",
    };
    return colors[type] || "badge-neutral";
  };

  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-base-100 py-8">
      <div className="w-1/2 hidden md:flex items-center justify-center p-8">
        <Lottie animationData={animationData} loop={true} />
      </div>
      <div className="container mx-auto px-4 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-base-100 shadow-xl max-w-md mx-auto"
        >
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-6 w-full">
              Register
            </h2>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-semibold">
                  Select User Type
                </span>
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Choose your role</option>
                <option value="admin">Admin</option>
                <option value="organization">Organization</option>
                <option value="organizer">Organizer</option>
                <option value="participant">Participant</option>
              </select>
            </div>
            {userType && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full"
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`badge ${getUserTypeColor(userType)} p-3 text-sm font-semibold text-white`}
                  >
                    {userType.charAt(0).toUpperCase() + userType.slice(1)} Registration
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {renderForm()}
                    <button
                      type="submit"
                      className="btn bg-red-500 text-white w-full"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? "Registering..."
                        : `Register as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
