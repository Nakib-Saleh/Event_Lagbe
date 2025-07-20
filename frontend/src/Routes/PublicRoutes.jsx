import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import ErrorPage from "../Components/Errorpage";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AdminDashboard from "../Pages/Dashboard/Admin/AdminDashboard";
import Verification from "../Pages/Dashboard/Admin/Verification";
import Profile from "../Pages/Dashboard/Profile";

const PublicRoutes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children:[
        {
          path:"/adminDashboard",
          element:<AdminDashboard></AdminDashboard>,
          children:[
            {
              path:"/adminDashboard",
              element:<Navigate to="/adminDashboard/profile" replace />
            },
            {
              path:"/adminDashboard/profile",
              element:<Profile></Profile>
            },
            {
              path:"/adminDashboard/verification",
              element:<Verification></Verification>
            }
          ]
        },
        {
            path:"/register",
            element:<Register></Register>
        },
        {
            path:"/login",
            element:<Login></Login>
        },
        {
          path:"/error",
          element:<ErrorPage></ErrorPage>
        },
        {
            path: "*",
            element:<ErrorPage></ErrorPage>
        }
      ]
    },
  ]);

export default PublicRoutes;