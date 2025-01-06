import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Loader, Mail, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const supabase = createClient(
  "https://tbglqduozbabzpeeqjcg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiZ2xxZHVvemJhYnpwZWVxamNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwOTQyNzYsImV4cCI6MjA1MTY3MDI3Nn0.Dh0kpfE_92J3IgUvrVEfwrSj-RzlGksgGes70Wv28hU"
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};

const Auth = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;
      if (data?.user) {
        onAuth?.(data.user);
        navigate("/dashboard"); // Redirect to the home page
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm text-gray-500">
            {isLogin
              ? "Sign in to your account"
              : "Create a new account to continue"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 px-4 py-3 rounded-xl text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-50 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02]"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin mx-auto" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          {isLogin
            ? "Don't have an account? Sign Up"
            : "Already have an account? Sign In"}
        </button>
      </div>
    </div>
  );
};

export const UserMenu = ({ user, onSignOut }) => {
  return (
    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm">
      <span className="text-sm text-gray-600 font-medium">{user.email}</span>
      <button
        onClick={onSignOut}
        className="p-2 rounded-full hover:bg-gray-100 transition-all"
        title="Sign Out"
      >
        <LogOut className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
};

export default Auth;
