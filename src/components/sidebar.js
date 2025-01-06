import React, { useEffect, useState } from "react";
import { Home, LayoutList, Cat, Loader, Lock } from "lucide-react";
import { NavLink, Outlet, Navigate, useNavigate } from "react-router-dom";
import Auth, { AuthProvider } from "./auth";
import { UserMenu } from "./auth";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tbglqduozbabzpeeqjcg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ2xxZHVvemJhYnpwZWVxamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwOTQyNzYsImV4cCI6MjA1MTY3MDI3Nn0.Dh0kpfE_92J3IgUvrVEfwrSj-RzlGksgGes70Wv28hU"
);

const Sidebar = ({ user, onSignOut }) => {


   const [subscription, setSubscription] = useState(null);
  
    useEffect(() => {
      const fetchSubscription = async () => {
        const { data } = await supabase
          .from("user_subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setSubscription(data || { status: "inactive" });
      };
      fetchSubscription();
    }, [user]);
  

  const navItems = [
    { path: "/dashboard/home", icon: Home, label: "Home" },
    { path: "/dashboard/history", icon: LayoutList, label: "History" },
    {
      path: "/dashboard/subscribe",
      icon: Lock,
      label:
        subscription?.status === "active" ? "Subscription" : "Unlock Premium",
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col flex-shrink-0">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <Cat className="h-8 w-8 text-purple-500" />
          <h1 className="text-2xl font-bold text-purple-500">Caps.ai</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-purple-50 text-purple-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <UserMenu user={user} onSignOut={onSignOut} />
      </div>
    </aside>
  );
};

const DashboardLayout = () => {
  const { user, loading: authLoading } = AuthProvider({ children: null });
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} onSignOut={handleSignOut} />
      <main className="flex-1 overflow-auto bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
