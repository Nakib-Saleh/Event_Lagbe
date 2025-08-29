import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import PublicRoutes from "./Routes/publicRoutes";
import AuthProvider from "./Provider/AuthProvider";
import { ThemeProvider } from "./Provider/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={PublicRoutes} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
