import { apiRequest } from "./api";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://backend1-5xtu.onrender.com";

/**
 * User signup
 */
export const signup = async (full_name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ full_name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Signup failed");
    }

    const data = await response.json().catch(() => ({}));
    return data; // Contains user info or token
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getMyProfile = () => {
  return apiRequest("/api/user/profile");
};

/**
 * Submit daily health log
 */
export const submitDailyLog = (logData) => {
  return apiRequest("/api/user/daily-log", "POST", logData);
};
