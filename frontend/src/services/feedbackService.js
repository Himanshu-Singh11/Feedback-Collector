import axios from 'axios';

/**
 * Pre-configured Axios client.
 * Base URL is loaded from environment variables (e.g., .env)
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api',
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Global response interceptor for consistent error handling across all API calls.
 * This separates network error logic from UI components.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the payload data, unpacking the axios response wrapper.
    // Assuming backend wraps success in { success: true, data: ... } or similar ApiResponse.
    // Our backend sends { status: 'success', data: ... }
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred.';

    if (error.response) {
      if (error.response.status === 401) {
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      errorMessage = error.response.data?.message || `Server Error: ${error.response.status}`;
    } else if (error.request) {
      errorMessage = 'Network error: Unable to reach the server. Please check your connection.';
    } else {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Core API Service methods for Feedback operations.
 */
const FeedbackService = {
  /**
   * Retrieves all feedback entries.
   * @returns {Promise<object>} API Response data
   */
  getFeedback: async () => {
    return await apiClient.get('/feedback');
  },

  /**
   * Submits a new feedback entry.
   * @param {object} payload - { name, email, message }
   * @returns {Promise<object>} API Response data
   */
  createFeedback: async (payload) => {
    return await apiClient.post('/feedback', payload);
  },

  /**
   * Deletes a feedback entry by ID.
   * @param {string} id - The MongoDB ObjectId
   * @returns {Promise<object>} API Response data
   */
  deleteFeedback: async (id) => {
    return await apiClient.delete(`/feedback/${id}`);
  },
};

export default FeedbackService;
