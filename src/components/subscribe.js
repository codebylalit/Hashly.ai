import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  CreditCard,
  Activity,
  Lock,
  LayoutList,
  Home,
  Cat,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { NavLink } from "react-router-dom";
import { UserMenu } from "./auth";

const supabase = createClient(
  "https://tbglqduozbabzpeeqjcg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ2xxZHVvemJhYnpwZWVxamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwOTQyNzYsImV4cCI6MjA1MTY3MDI3Nn0.Dh0kpfE_92J3IgUvrVEfwrSj-RzlGksgGes70Wv28hU"
);

const PremiumFeaturesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <span className="sr-only">Close</span>×
        </button>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Unlock Premium Features</h2>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-700 mb-2">
              Premium Benefits
            </h3>
            <ul className="space-y-2 text-sm text-purple-600">
              <li className="flex items-center gap-2">
                <Lock size={16} />
                Unlimited AI Generations
              </li>
              <li className="flex items-center gap-2">
                <Lock size={16} />
                Priority Support
              </li>
              <li className="flex items-center gap-2">
                <Lock size={16} />
                Advanced Analytics
              </li>
            </ul>
          </div>
          <button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

const SubscriptionDashboard = ({ user }) => {
  const [usageStats, setUsageStats] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
    fetchUsageStats();
  }, [user]);

  const fetchSubscriptionData = async () => {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      setSubscription(data);
    } else {
      setSubscription({ status: "inactive" });
    }
  };

  const fetchUsageStats = async () => {
    const { data, error } = await supabase
      .from("usage_analytics")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error) {
      setUsageStats(data);
    }
  };

  // Fixed condition to properly check subscription status
  if (!subscription || subscription.status !== "active") {
    return (
      <div className="p-6">
        <div className="text-center space-y-4">
          <Lock className="h-12 w-12 text-purple-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900">
            Unlock Premium Features
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Subscribe to access unlimited generations, priority support, and
            advanced analytics.
          </p>
          <button
            onClick={() => setShowPremiumModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg"
          >
            View Premium Benefits
          </button>
        </div>
        <PremiumFeaturesModal
          isOpen={showPremiumModal}
          onClose={() => setShowPremiumModal(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Subscription Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <CreditCard size={32} className="text-purple-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Subscription Status
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                <span className="text-green-500">Active</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Calendar size={32} className="text-purple-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Next Payment
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {subscription?.current_period_end
                  ? new Date(
                      subscription.current_period_end
                    ).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <Activity size={32} className="text-purple-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Usage This Month
              </h3>
              <p className="text-lg font-semibold text-gray-900">
                {usageStats?.length || 0} generations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-medium mb-4">Usage History</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={usageStats}>
              <XAxis dataKey="created_at" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="generations" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

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
          <Cat size={32} className="text-purple-500" />
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
                <Icon size={20} />
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

export { SubscriptionDashboard, Sidebar };
