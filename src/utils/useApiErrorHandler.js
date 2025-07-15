import { message } from 'antd';

export const useApiErrorHandler = () => {
  const handleApiError = async (promise) => {
    try {
      const response = await promise;
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle different status codes
        switch (response.status) {
          case 400:
            message.error(errorData.message || 'Bad request');
            break;
          case 401:
            message.error('Session expired. Please login again.');
            // You can add redirect to login here if needed
            break;
          case 403:
            message.error('Access denied');
            break;
          case 404:
            message.error('Resource not found');
            break;
          case 500:
            message.error('Internal server error');
            break;
          default:
            message.error('Something went wrong');
        }
        throw new Error(errorData.message || 'API Error');
      }
      return response.json();
    } catch (error) {
      if (!error.response) {
        message.error('Network error. Please check your connection.');
      }
      throw error;
    }
  };

  return { handleApiError };
}; 