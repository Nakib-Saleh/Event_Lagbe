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
const PrivateRoute = ({ children, allowedRoles }) => {
    const { loading, user, userRole } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="w-32 text-center py-8 text-gray-500">
                Loading...
            </div>
        );
    }

    if (!user) {
        // Not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Authenticated but not authorized
        return <Navigate to="/error" replace />;
    }

    // Authenticated (and authorized if roles specified)
    return children;
};

export default PrivateRoute;
