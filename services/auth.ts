// API URL for the Spring Boot Backend
const API_URL = "http://localhost:8080/api/auth";
const USER_API_URL = "http://localhost:8080/api/users";

// --- MOCK FALLBACK SYSTEM ---
// If the backend is down (Failed to fetch), we use this local logic so the app still works for testing.

const mockLogin = async (email, password) => {
  console.warn("⚠️ Backend unreachable. Switching to Mock Data.");
  await new Promise(r => setTimeout(r, 800)); // Simulate delay
  
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) { // Simple check (in real app, assume hashed)
    throw new Error("Invalid credentials (Mock)");
  }
  
  const mockToken = `mock-jwt-token-${Date.now()}`;
  return { ...user, token: mockToken };
};

const mockRegister = async (username, email, password) => {
  console.warn("⚠️ Backend unreachable. Switching to Mock Data.");
  await new Promise(r => setTimeout(r, 800));

  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  if (users.find(u => u.email === email)) throw new Error("Email already exists (Mock)");
  
  const newUser = { id: Date.now(), username, email, password, roles: ['ROLE_USER'], roadmapJson: null };
  users.push(newUser);
  localStorage.setItem('mock_users', JSON.stringify(users));
  
  return { message: "User registered successfully (Mock)" };
};

const mockUpdate = async (userId, userData) => {
  console.warn("⚠️ Backend unreachable. Switching to Mock Data.");
  await new Promise(r => setTimeout(r, 800));

  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) throw new Error("User not found (Mock)");
  
  const updatedUser = { ...users[index], ...userData };
  if (userData.password) updatedUser.password = userData.password; 
  
  users[index] = updatedUser;
  localStorage.setItem('mock_users', JSON.stringify(users));
  
  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

const mockForgotPassword = async (email) => {
  console.warn("⚠️ Backend unreachable. Switching to Mock Data.");
  await new Promise(r => setTimeout(r, 800));
  
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const user = users.find(u => u.email === email);
  
  // Even if user doesn't exist, we typically don't reveal it, but for mock debugging we return a token if found
  if (user) {
    const token = `mock-reset-token-${Date.now()}`;
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    localStorage.setItem('mock_users', JSON.stringify(users));
    return { message: "Reset link sent", token }; 
  }
  
  return { message: "If your email exists, a reset link has been sent." };
};

const mockResetPassword = async (token, newPassword) => {
  console.warn("⚠️ Backend unreachable. Switching to Mock Data.");
  await new Promise(r => setTimeout(r, 800));
  
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const userIndex = users.findIndex(u => u.resetToken === token);
  
  if (userIndex === -1) throw new Error("Invalid or expired token");
  
  const user = users[userIndex];
  if (user.resetTokenExpiry < Date.now()) throw new Error("Token expired");
  
  user.password = newPassword;
  delete user.resetToken;
  delete user.resetTokenExpiry;
  
  users[userIndex] = user;
  localStorage.setItem('mock_users', JSON.stringify(users));
  
  return { message: "Password reset successfully" };
};

const mockSaveRoadmap = async (userId, roadmapData) => {
    console.warn("⚠️ Backend unreachable. Mocking roadmap save.");
    await new Promise(r => setTimeout(r, 500));
    
    const user = getCurrentUser();
    if (!user || user.id !== userId) throw new Error("User mismatch (Mock)");

    const updatedUser = { ...user, roadmapJson: JSON.stringify(roadmapData) };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
};


// --- MAIN AUTH FUNCTIONS ---

export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }

    const data = await response.json();
    if (data.token) localStorage.setItem("user", JSON.stringify(data));
    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const data = await mockLogin(email, password);
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    }
    throw error;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role: ["user"] }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Registration failed");
    }

    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return await mockRegister(username, email, password);
    }
    throw error;
  }
};

export const updateProfile = async (userId, userData) => {
  const user = getCurrentUser();
  const token = user?.token;
  if (!token) throw new Error("Not authenticated");

  try {
    const response = await fetch(`${USER_API_URL}/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Update failed");
    }

    const updatedInfo = await response.json();
    // Ensure we preserve the existing token when updating local user state
    const updatedUser = { 
        ...user, 
        ...updatedInfo,
        token: user.token // Explicitly preserve token
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      const updatedInfo = await mockUpdate(userId, userData);
      const updatedUser = { 
          ...user, 
          ...updatedInfo,
          token: user.token // Explicitly preserve token
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }
    throw error;
  }
};

export const saveRoadmap = async (userId, roadmapData) => {
    const user = getCurrentUser();
    const token = user?.token;
    if (!token) throw new Error("Not authenticated");

    try {
        const response = await fetch(`${USER_API_URL}/${userId}/roadmap`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ roadmapJson: JSON.stringify(roadmapData) }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to save roadmap");
        }
        
        // Update local storage to reflect the change immediately
        const updatedUser = { ...user, roadmapJson: JSON.stringify(roadmapData) };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return updatedUser;

    } catch (error) {
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            return await mockSaveRoadmap(userId, roadmapData);
        }
        throw error;
    }
};

export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Request failed");
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return await mockForgotPassword(email);
    }
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Reset failed");
    }
    return await response.json();
  } catch (error) {
    if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
      return await mockResetPassword(token, newPassword);
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("user");
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