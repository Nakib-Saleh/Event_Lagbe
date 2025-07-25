import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import ErrorPage from "../Components/Errorpage";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import Profile from "../Pages/Dashboard/Profile";
import Verification from "../Pages/Dashboard/Admin/Verification";
import OrganizationVerification from "../Pages/Dashboard/Organization/Verification";
import UserList from "../Pages/Dashboard/Admin/UserList";
import SkillsList from "../Pages/Dashboard/Admin/SkillsList";
import Calendar from "../Pages/Dashboard/Admin/Calendar";
import PrivateRoute from "./PrivateRoutes";
import OrganizationDashboard from "../Pages/Dashboard/Organization/OrganizationDashboard";
import OrganizerList from "../Pages/Dashboard/Organization/OrganizerList";
import Eventlist from "../Pages/Dashboard/Organization/Eventlist";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile";

const PublicRoutes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/adminDashboard",
        element: (
          <PrivateRoute allowedRoles={["admin"]}>
            <AdminDashboard></AdminDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/adminDashboard",
            element: <Navigate to="/adminDashboard/profile" replace />,
          },
          {
            path: "/adminDashboard/profile",
            element: <AdminProfile></AdminProfile>,
          },
          {
            path: "/adminDashboard/verification",
            element: <Verification></Verification>,
          },
          {
            path: "/adminDashboard/users",
            element: <UserList></UserList>,
          },
          {
            path: "/adminDashboard/skills",
            element: <SkillsList></SkillsList>,
          },
          {
            path: "/adminDashboard/calendar",
            element: <Calendar></Calendar>,
          },
        ],
      },
      {
        path: "/organizationDashboard",
        element: (
          <PrivateRoute allowedRoles={["organization"]}>
            <OrganizationDashboard></OrganizationDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/organizationDashboard",
            element: <Navigate to="/organizationDashboard/profile" replace />,
          },
          {
            path: "/organizationDashboard/profile",
            element: <Profile></Profile>,
          },
          {
            path: "/organizationDashboard/verification",
            element: <OrganizationVerification></OrganizationVerification>,
          },
          {
            path: "/organizationDashboard/organizers",
            element: <OrganizerList></OrganizerList>,
          },
          {
            path: "/organizationDashboard/events",
            element: <Eventlist></Eventlist>,
          },
        ],
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/error",
        element: <ErrorPage></ErrorPage>,
      },
      {
        path: "*",
        element: <ErrorPage></ErrorPage>,
      },
    ],
  },
]);

export default PublicRoutes;
