import React, { useState, useEffect } from "react";
import { Save, Loader } from "lucide-react";
import { supabase } from "./supabaseClient"; // Ensure you import supabase

const UserSettings = ({ user }) => {
  const [preferences, setPreferences] = useState({
    default_caption_length: "medium",
    preferred_categories: [],
    notification_email: true,
    theme: "light",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadPreferences();
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, [user]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // Exclude "no rows found" error
      if (data) setPreferences(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load preferences. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const { error } = await supabase.from("user_preferences").upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      setMessage("Preferences saved successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to save preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">User Preferences</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Default Caption Length
          </label>
          <select
            value={preferences.default_caption_length}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                default_caption_length: e.target.value,
              })
            }
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            value={preferences.theme}
            onChange={(e) =>
              setPreferences({ ...preferences, theme: e.target.value })
            }
            className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={preferences.notification_email}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  notification_email: e.target.checked,
                })
              }
              className="rounded border-gray-300 text-purple-500 focus:ring-purple-400"
            />
            <span className="text-sm">Receive email notifications</span>
          </label>
        </div>

        <button
          onClick={savePreferences}
          disabled={saving}
          className="w-full p-3 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Preferences
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
