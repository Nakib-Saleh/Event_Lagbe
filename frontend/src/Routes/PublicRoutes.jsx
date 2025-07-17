import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Components/MainLayout";
import ErrorPage from "../Components/Errorpage";
import Register from "../Pages/Register";

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