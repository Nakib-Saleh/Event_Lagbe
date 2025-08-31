import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout.jsx";
import ErrorPage from "../Components/ErrorPage.jsx";
import Home from "../Pages/Home.jsx";
import Register from "../Pages/Register.jsx";
import Login from "../Pages/Login.jsx";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard.jsx";
import Verification from "../Pages/Dashboard/Admin/Verification.jsx";
import OrganizationVerification from "../Pages/Dashboard/Organization/Verification.jsx";
import UserList from "../Pages/Dashboard/Admin/UserList.jsx";
import SkillsList from "../Pages/Dashboard/Admin/SkillsList.jsx";
import AdminCalendar from "../Pages/Dashboard/Admin/Calendar.jsx";
import DeactivateExpiredEvents from "../Pages/Dashboard/Admin/DeactivateExpiredEvents.jsx";
import CreateAdmin from "../Pages/Dashboard/Admin/CreateAdmin.jsx";
import PrivateRoute from "./PrivateRoutes.jsx";
import OrganizationDashboard from "../Pages/Dashboard/Organization/OrganizationDashboard.jsx";
import OrganizerList from "../Pages/Dashboard/Organization/OrganizerList.jsx";
import AdminProfile from "../Pages/Dashboard/Admin/AdminProfile.jsx";
import OrgProfile from "../Pages/Dashboard/Organization/OrgProfile.jsx";
import ParticipantDashboard from "../Pages/Dashboard/Participant/ParticipantDashboard.jsx";
import ParticipantProfile from "../Pages/Dashboard/Participant/ParticipantProfile.jsx";
import BookmarkedEvents from "../Pages/Dashboard/Participant/BookmarkedEvents.jsx";
import RegisteredEvents from "../Pages/Dashboard/Participant/RegisteredEvents.jsx";
import Followers from "../Pages/Dashboard/Participant/Followers.jsx";
import Following from "../Pages/Dashboard/Participant/Following.jsx";
import ParticipantCalendar from "../Pages/Dashboard/Participant/Calendar.jsx";
import OrganizerDashboard from "../Pages/Dashboard/Organizer/OrganizerDashboard.jsx";
import OrganizerProfile from "../Pages/Dashboard/Organizer/OrganizerProfile.jsx";
import RunningEvents from "../Pages/Dashboard/Organizer/RunningEvents.jsx";
import OrganizerPastEvents from "../Pages/Dashboard/Organizer/PastEvents.jsx";
import OrganizerFollowers from "../Pages/Dashboard/Organizer/Followers.jsx";
import OrganizerFollowing from "../Pages/Dashboard/Organizer/Following.jsx";
import OrganizerRegisteredList from "../Pages/Dashboard/Organizer/RegisteredList.jsx";
import OrganizationRegisteredList from "../Pages/Dashboard/Organization/RegisteredList.jsx";
import PublicProfile from "../Pages/PublicProfile.jsx";
import EventAdd from "../Pages/EventAdd.jsx";
import EventEdit from "../Pages/EventEdit.jsx";
import Connect from "../Pages/Connect.jsx";
import AllEvents from "../Pages/AllEvents.jsx";
import EventDetails from "../Pages/EventDetails.jsx";

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
        path: "/event-edit/:eventId",
        element: (
          <PrivateRoute allowedRoles={["organization", "organizer"]}>
            <EventEdit></EventEdit>
          </PrivateRoute>
        ),
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
            element: <AdminCalendar></AdminCalendar>,
          },
          {
            path: "/adminDashboard/deactivate-expired-events",
            element: <DeactivateExpiredEvents></DeactivateExpiredEvents>,
          },
          {
            path: "/adminDashboard/create-admin",
            element: <CreateAdmin></CreateAdmin>,
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
            element: <Navigate to="/organizationDashboard/events/running" replace />,
          },
          {
            path: "/organizationDashboard/events/running",
            element: <RunningEvents></RunningEvents>,
          },
          {
            path: "/organizationDashboard/events/past",
            element: <OrganizerPastEvents></OrganizerPastEvents>,
          },
          {
            path: "/organizationDashboard/followers",
            element: <Followers></Followers>,
          },
          {
            path: "/organizationDashboard/following",
            element: <Following></Following>,
          },
          {
            path: "/organizationDashboard/registered-list",
            element: <OrganizationRegisteredList></OrganizationRegisteredList>,
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
        path: "/organizerDashboard",
        element: (
          <PrivateRoute allowedRoles={["organizer"]}>
            <OrganizerDashboard></OrganizerDashboard>
          </PrivateRoute>
        ),
        children: [
          {
            path: "/organizerDashboard",
            element: <Navigate to="/organizerDashboard/profile" replace />,
          },
          {
            path: "/organizerDashboard/profile",
            element: <OrganizerProfile></OrganizerProfile>,
          },
          {
            path: "/organizerDashboard/events/running",
            element: <RunningEvents></RunningEvents>,
          },
          {
            path: "/organizerDashboard/events/past",
            element: <OrganizerPastEvents></OrganizerPastEvents>,
          },
          {
            path: "/organizerDashboard/followers",
            element: <OrganizerFollowers></OrganizerFollowers>,
          },
          {
            path: "/organizerDashboard/following",
            element: <OrganizerFollowing></OrganizerFollowing>,
          },
          {
            path: "/organizerDashboard/registered-list",
            element: <OrganizerRegisteredList></OrganizerRegisteredList>,
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
