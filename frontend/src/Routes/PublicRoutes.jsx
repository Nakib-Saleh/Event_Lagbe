import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import ErrorPage from "../Components/Errorpage";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
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
import OrgProfile from "../Pages/Dashboard/Organization/OrgProfile";
import ParticipantDashboard from "../Pages/Dashboard/Participant/ParticipantDashboard";
import ParticipantProfile from "../Pages/Dashboard/Participant/ParticipantProfile";
import BookmarkedEvents from "../Pages/Dashboard/Participant/BookmarkedEvents";
import RegisteredEvents from "../Pages/Dashboard/Participant/RegisteredEvents";
import PastEvents from "../Pages/Dashboard/Participant/PastEvents";
import Followers from "../Pages/Dashboard/Participant/Followers";
import Following from "../Pages/Dashboard/Participant/Following";
import ParticipantCalendar from "../Pages/Dashboard/Participant/Calendar";
import PublicProfile from "../Pages/PublicProfile";
import EventAdd from "../Pages/EventAdd";
import Connect from "../Pages/Connect";
import AllEvents from "../Pages/AllEvents";
import EventDetails from "../Pages/EventDetails";

const PublicRoutes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        path: "/",
        element: <Home></Home>,
      },
      {
        path: "/Connect",
        element: (
          <PrivateRoute>
            <Connect></Connect>
          </PrivateRoute>
        ),
      },
      {
        path: "/events",
        element: <AllEvents></AllEvents>,
      },
      {
        path: "/event/:eventId",
        element: <EventDetails></EventDetails>,
      },
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
            element: <OrgProfile></OrgProfile>,
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
          {
            path: "/organizationDashboard/followers",
            element: <Followers></Followers>,
          },
          {
            path: "/organizationDashboard/following",
            element: <Following></Following>,
          },
        ],
      },
      {
        path: "/participantDashboard",
        element: (
          <PrivateRoute allowedRoles={["participant"]}>
            <ParticipantDashboard></ParticipantDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/participantDashboard",
            element: <Navigate to="/participantDashboard/profile" replace />,
          },
          {
            path: "/participantDashboard/profile",
            element: <ParticipantProfile></ParticipantProfile>,
          },
          {
            path: "/participantDashboard/bookmarked-events",
            element: <BookmarkedEvents></BookmarkedEvents>,
          },
          {
            path: "/participantDashboard/registered-events",
            element: <RegisteredEvents></RegisteredEvents>,
          },
          {
            path: "/participantDashboard/past-events",
            element: <PastEvents></PastEvents>,
          },
          {
            path: "/participantDashboard/followers",
            element: <Followers></Followers>,
          },
          {
            path: "/participantDashboard/following",
            element: <Following></Following>,
          },
          {
            path: "/participantDashboard/calendar",
            element: <ParticipantCalendar></ParticipantCalendar>,
          },
        ],
      },
      {
        path: "/add-event",
        element: (
          <PrivateRoute allowedRoles={["organization","organizer"]}>
            <EventAdd></EventAdd>
          </PrivateRoute>
        ),
      },
      {
        path: "/profile/:firebaseUid",
        element: <PublicProfile></PublicProfile>,
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
