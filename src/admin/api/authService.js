
import axios from "axios";

const API_BASE_URL = "https://trackray-auth-service-backend.onrender.com"; 

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// token 
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// LOGIN
export const loginUser = async ({ email, password }) => {
  const response = await api.post(
    "/api/auth/login",
    new URLSearchParams({
      username: email,
      password,
      grant_type: "password",
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("refresh_token", response.data.refresh_token);

  return response.data;
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};


export const refreshToken = async () => {
  const response = await api.get("/api/auth/refresh-token");
  localStorage.setItem("access_token", response.data.access_token);
  return response.data;
};


// Resend verification
export const resendVerification = async (email) => {
  const response = await api.post("/api/auth/resend-verification", { email });
  return response.data;
};

// Activate account
export const activateAccount = async (email, verification_code) => {
  const response = await api.post("/api/auth/activate-account", { email, verification_code });
  return response.data;
};

// Password reset
export const passwordReset = async (email) => {
  const response = await api.post("/api/auth/password-reset", { email });
  return response.data;
};

// Confirm reset
export const confirmPasswordReset = async (token, new_password, confirm_new_password) => {
  const response = await api.post(`/api/auth/password-reset/confirm/${token}`, {
    new_password,
    confirm_new_password
  });
  return response.data;
};

