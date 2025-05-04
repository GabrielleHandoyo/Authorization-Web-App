import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData);

  if (response.data) {
    // Ensure username is included in the storage
    localStorage.setItem("user", JSON.stringify(response.data));
    window.dispatchEvent(new Event("storage"));
  }

  return response.data;
};

// Log user in
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    // Ensure username is included in the storage
    localStorage.setItem("user", JSON.stringify(response.data));
    window.dispatchEvent(new Event("storage"));
  }

  return response.data;
};

// Log user out
const logout = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("storage"));
};

// Get User Profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(`${API_URL}/profile`, config);
  return response.data;
};

export default { register, login, logout, getProfile };
