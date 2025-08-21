import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const message = error.response.data?.message;

      if (message === "User session Expired" || message === "Access denied") {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        window.location.href = "/login"; // or "/" if your login is root
      }
    }
    return Promise.reject(error);
  }
);

export const registerUser = async (userData: {
  username: string;
  fullname: string;
  usertype: string;
  email_address: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw {
        message: "network error",
      };
    }
  }
};

export const loginUser = async (loginData: {
  identifier: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/", loginData);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw {
        message: "network error",
      };
    }
  }
};
// Get current user's profile
export const getProfile = async () => {
  try {
    const response = await api.get("/profile/me");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
};

export const createOrUpdateProfile = async (profileData: {
  avatar?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  availability?: boolean[];
  contact?: {
    email?: string;
    github?: string;
    linkedin?: string;
  };
  qualifications?: {
    title: string;
    institute?: string;
    year?: string;
  }[];
  experience?: {
    title: string;
    company?: string;
    startYear?: string;
    endYear?: string;
    description?: string;
  }[];
}) => {
  try {
    const response = await api.post("/profile/me", profileData);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw { message: "Network error" };
    }
  }
};

//search for text indexes

export const searchProfiles = async (query: string) => {
  try {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

//categorical search

export const searchByCategory = async (category: string) => {
  try {
    const response = await api.get(
      `/search/category?category=${encodeURIComponent(category)}`
    );
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};
export const getTopProfiles = async () => {
  try {
    const response = await api.get("/search/top"); // backend route
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

//search by availability
export const searchByAvailability = async (days: number) => {
  try {
    const response = await api.get(`/search/availability?days=${days}`);
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

//user settings api calls
export const updateUsernameAPI = async (username: string) => {
  try {
    const response = await api.post("/profile/updateUsername", { username });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

export const updateEmailAPI = async (email_address: string) => {
  try {
    const response = await api.post("/profile/updateSignedEmail", {
      email_address,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

export const updatePasswordAPI = async (
  oldPassword: string,
  newPassword: string
) => {
  try {
    const response = await api.post("/profile/updatePassword", {
      oldPassword,
      newPassword,
    });
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

export const switchToProfessionalAPI = async () => {
  try {
    const response = await api.post("/profile/switchtopro");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

export const switchToUserAPI = async () => {
  try {
    const response = await api.post("/profile/switchtouser");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message: string }>;
    if (error.response && error.response.data) throw error.response.data;
    throw { message: "Network error" };
  }
};

export default api;
