/**
 * Login user using external backend
 * Expected response:
 * {
 *   token: "...",
 *   user: { id, full_name, email, role }
 * }
 */
export const loginService = async (email, password) => {
  const res = await fetch("https://backend1-5xtu.onrender.com/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = body.detail || body.message || "Login failed";
    throw new Error(err);
  }

  const token = body.token;
  const user = body.user || {};
  const role = user.role || "user";

  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("user", JSON.stringify(user));

  return role;
};
