import axios from 'axios';

export const API_BASE_URL = 'https://rentoapi.dsrt321.online/api/v1';
// export const API_BASE_URL = 'http://10.10.7.76:14005/api';
export const PIC_BASE_URL = 'https://rentoapi.dsrt321.online';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    try {
      
      const response = await api.post('/auth/login/', credentials);
      
      const { access, refresh } = response.data;
      
      if (access) {
        // Store the access token as the main auth token
        localStorage.setItem('authToken', access);
        localStorage.setItem('refreshToken', refresh);
        
        // Create a basic user object (you might want to decode the JWT to get user info)
        const userInfo = {
          id: '1', // This should be extracted from the JWT token
          email: credentials.email,
          // Add other user fields as needed
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }
      
      return {
        token: access,
        user: JSON.parse(localStorage.getItem('user')),
        access,
        refresh
      };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Return more detailed error information
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Login failed';
      
      throw { message: errorMessage, status: error.response?.status };
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default api;