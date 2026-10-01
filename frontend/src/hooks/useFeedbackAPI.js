import { useState, useCallback } from 'react';
import FeedbackService from '../services/FeedbackService';

/**
 * Custom hook to manage feedback state (Loading, Success, Error, Network failure)
 * and encapsulate all API interactions, keeping them out of UI components.
 */
export function useFeedbackAPI() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState(null);

  /**
   * Fetch all feedback entries
   */
  const getFeedback = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await FeedbackService.getFeedback();
      // Assuming backend uses ApiResponse: { status, message, data }
      setFeedbacks(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new feedback entry
   */
  const createFeedback = useCallback(async (payload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await FeedbackService.createFeedback(payload);
      // Prepend the new feedback to the list instantly (optimistic-like)
      setFeedbacks((prev) => [response.data, ...prev]);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a feedback entry
   */
  const deleteFeedback = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await FeedbackService.deleteFeedback(id);
      // Remove it from local state
      setFeedbacks((prev) => prev.filter((item) => item._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Helper to manually clear errors (e.g., when a user dismisses a toast)
   */
  const clearError = useCallback(() => setError(null), []);

  return {
    feedbacks,
    isLoading,
    error,
    clearError,
    getFeedback,
    createFeedback,
    deleteFeedback,
  };
}
