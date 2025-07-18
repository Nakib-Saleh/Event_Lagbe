import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import ErrorPage from "../Components/Errorpage";
import Register from "../Pages/Register";
import Login from "../Pages/Login";

const PublicRoutes = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout></MainLayout>,
      children:[
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