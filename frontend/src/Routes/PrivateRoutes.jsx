import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../Provider/AuthContext";

/**
 * PrivateRoute Component
 * - Restricts access to authenticated users only.
 * - Redirects unauthenticated users to the login page.
 *
 * Usage:
 * <PrivateRoute><SomeComponent /></PrivateRoute>
 */
const PrivateRoute = ({ children }) => {
    // Access authentication state from AuthContext
    const { loading, user } = useContext(AuthContext);
    const location = useLocation();

    // Show a loading spinner while authentication state is being determined.
    if (loading) {
        return (
            <div className="w-32 text-center py-8 text-gray-500">
                Loading...
            </div>
        );
    }

    // If the user is authenticated, render the protected content (children).
    if (user) {
        return children;
    }

    // If the user is not authenticated, redirect them to the login page.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
