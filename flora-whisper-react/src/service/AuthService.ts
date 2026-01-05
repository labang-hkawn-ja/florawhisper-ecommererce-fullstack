import axios from "axios";
import type { LoginDto } from "../dto/LoginDto";
import type { RegisterDto } from "../dto/RegisterDto";

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const api = axios.create({
  baseURL: "http://localhost:8080/api", 
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Token added to request:", token.substring(0, 20) + "...");
  } else {
    console.log("No token found for request");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized - Token might be invalid/expired");
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginApiCall = (login: LoginDto) =>
  api.post(`/auth/login`, login);

export const registerApiCall = (registerDto: RegisterDto, type: string) =>
  api.post(`/auth/register/${type}`, registerDto, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const changePasswordApiCall = async (id: number, changePasswordRequest: ChangePasswordRequest) => {
  return api.put(`/auth/${id}/change-password`, changePasswordRequest);
};

// Token management
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
  console.log("Token stored in localStorage");
}

export const getToken = () => {
  const token = localStorage.getItem("token");
  console.log("Token retrieved:", token ? token.substring(0, 20) + "..." : "null");
  return token;
}

export const logoutApiCall = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("loggedInUserName");
  sessionStorage.removeItem("loggedInUserRole");
  window.location.reload();
}

export const setLoggedInUserName = (username: string) => {
  sessionStorage.setItem("loggedInUserName", username);
}

export const getLoggedInUserName = () => 
  sessionStorage.getItem("loggedInUserName");

export const setLoggedInUserRole = (role: string) => {
  sessionStorage.setItem("loggedInUserRole", role);
}

export const getLoggedInUserRole = () => 
  sessionStorage.getItem("loggedInUserRole");

export const isLoggedIn = () => {
  const token = getToken();
  const username = getLoggedInUserName();
  const isLoggedIn = token !== null && username !== null;
  console.log("Auth status - Token:", !!token, "Username:", !!username, "LoggedIn:", isLoggedIn);
  return isLoggedIn;
}

export const isCustomer = () => {
  const role = getLoggedInUserRole();
  return role?.trim() === "ROLE_CUSTOMER";
}

export const isAdmin = () => {
  const role = getLoggedInUserRole();
  return role?.trim() === "ROLE_ADMIN";
}

export const isBankUser = () => {
  const role = getLoggedInUserRole();
  return role?.trim() === "ROLE_BANKUSER";
}

export default api;