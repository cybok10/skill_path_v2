import api from './api';

// API URL for the Spring Boot Backend
const API_URL = "/api/auth";
const USER_API_URL = "/api/users";

// --- MAIN AUTH FUNCTIONS ---

export const login = async (email, password) => {
  const response = await api.post(`${API_URL}/signin`, { email, password });
  if (response.data.token) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await api.post(`${API_URL}/signup`, { username, email, password, role: ["user"] });
  return response.data;
};

export const updateProfile = async (userId, userData) => {
  const response = await api.put(`${USER_API_URL}/${userId}`, userData);
  const updatedInfo = response.data;
  
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { 
        ...user, 
        ...updatedInfo,
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  }
  return updatedInfo;
};

export const saveRoadmap = async (userId, roadmapData) => {
  await api.put(`${USER_API_URL}/${userId}/roadmap`, { 
    roadmapJson: JSON.stringify(roadmapData) 
  });

  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, roadmapJson: JSON.stringify(roadmapData) };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  }
};

export const completeRoadmapNode = async (nodeId: string) => {
  const response = await api.post(`/api/users/roadmap/nodes/${nodeId}/complete`);
  const updatedRoadmap = response.data;
  
  const user = getCurrentUser();
  if (user) {
    const updatedUser = { ...user, roadmapJson: JSON.stringify(updatedRoadmap) };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  }
  
  return updatedRoadmap;
};


export const forgotPassword = async (email) => {
  const response = await api.post(`${API_URL}/forgot-password`, { email });
  return response.data;
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post(`${API_URL}/reset-password`, { token, newPassword });
  return response.data;
};

export const logout = async () => {
  try {
    const user = getCurrentUser();
    if (user && user.refreshToken) {
      await api.post(`${API_URL}/logout`, { refreshToken: user.refreshToken });
    }
  } catch (error) {
    console.error("Logout failed, but clearing session locally.", error);
  } finally {
    localStorage.removeItem("user");
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
  } catch (e) {
    console.warn("Failed to parse user from local storage", e);
    return null;
  }
  return null;
};

export const completeActivity = async () => {
    try {
        const response = await api.post(`${USER_API_URL}/complete-activity`);
        return response.data;
    } catch (error) {
        console.error("Failed to complete activity:", error);
        throw error;
    }
}