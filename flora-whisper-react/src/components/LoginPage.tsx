import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  loginApiCall,
  setLoggedInUserName,
  setLoggedInUserRole,
  setToken,
} from "../service/AuthService";
import type { LoginDto } from "../dto/LoginDto";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginDto>({
    userNameOrEmail: "",
    password: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending login request:", formData);
      const response = await loginApiCall(formData);
      console.log("Login response:", response);
      console.log("Response data:", response.data);

      const token = response.data.token;
      const username = response.data.username;
      const role = response.data.roleName; 

      console.log(
        "Extracted - Token:",
        token,
        "Username:",
        username,
        "Role:",
        role
      );

      if (token && username && role) {
        // Store JWT token and user info
        setToken(token);
        setLoggedInUserName(username);
        setLoggedInUserRole(role);

        console.log("Login successful! Token stored");

        setFormData({ userNameOrEmail: "", password: "" });

        // Navigate based on role
        if (role === "ROLE_BANKUSER") {
          navigate("/bank-dashboard");
        } else {
          navigate("/");
        }

        // Optional: reload to update auth state throughout app
        window.location.reload();
      } else {
        console.error("Missing required fields in response");
        console.error("Token:", token, "Username:", username, "Role:", role);
        throw new Error("Invalid response from server");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Login error:", err);
      console.error("Error response data:", err.response?.data);

      if (err.response?.status === 401) {
        setMessage("Invalid username or password");
      } else if (err.response?.data?.error) {
        setMessage(err.response.data.error);
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-15 min-h-screen bg-white flex items-center justify-center py-12 px-4 relative">
      {/* Notification */}
      {message && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50 ${
            message.includes("success") || message.includes("Welcome")
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{message}</span>
            <button
              onClick={() => setMessage(null)}
              className="ml-4 text-sm font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-3xl shadow-2xl p-8 border border-emerald-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-emerald-600">
              Sign in to your FloraWhisper account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="text-emerald-600 space-y-6">
            <div>
              <label
                htmlFor="userNameOrEmail"
                className="block text-sm font-medium text-emerald-700 mb-2"
              >
                Username Or Email Address
              </label>
              <input
                id="userNameOrEmail"
                name="userNameOrEmail"
                type="text"
                required
                value={formData.userNameOrEmail}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border bg-white border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 disabled:opacity-50"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-emerald-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-4 py-3 border bg-white border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 disabled:opacity-50"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-emerald-200"></div>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 pt-5 text-center">
            <p className="text-emerald-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
