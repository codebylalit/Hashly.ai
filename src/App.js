import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { CaptionHistory } from "./components/caphistory";
import Landing from "./components/landing";
import Auth from "./components/auth";
import Try from "./components/freetry";
import Home from "./components/home";

import { AuthProvider } from "./components/auth";
import DashboardLayout from "./components/sidebar";
import {SubscriptionDashboard } from "./components/subscribe";

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = AuthProvider({});

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/try",
    element: <Try />,
  },
  {
    path: "/login",
    element: <Auth onAuth={(user) => console.log("Logged in:", user)} />,
  },
  {
    path: "/signup",
    element: <Auth onAuth={(user) => console.log("Signed up:", user)} />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "history",
        element: <CaptionHistory />,
      },
      {
        path: "subscribe",
        element: <SubscriptionDashboard/>,
      },
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
