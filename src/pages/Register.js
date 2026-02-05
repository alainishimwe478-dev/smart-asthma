import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { signup } from "../services/userService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await signup(name, email, password);
      console.log("API RESPONSE:", response);

      // Assuming response includes token and role
      localStorage.setItem("token", response.token || "demo-token");
      localStorage.setItem("role", response.role || "user");
      setSuccessMessage("Registration successful! Redirecting to login...");
      setLoading(false);
      // short delay so user sees success briefly
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("API ERROR:", err.response?.data || err.message);
      setLoading(false);
      setError(
        err.detail ||
        err.message ||
        "Signup failed. Please check your details."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-100 to-green-200 animate-fadeIn">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-xl rounded-2xl p-8 sm:p-12 w-full max-w-md transform transition duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium animate-pulse">
            {error}
          </p>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-10"
          />
          <div
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </div>
        </div>

        <div className="mb-6 relative">
          <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition pr-10"
          />
          <div
            className="absolute right-3 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-green-700 text-white py-3 rounded-lg transition font-semibold shadow-lg ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-800"
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Signing up...
            </span>
          ) : (
            "Register"
          )}
        </button>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login here
          </span>
        </p>
      </form>
    </div>
  );
}
