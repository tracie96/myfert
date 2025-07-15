import { message } from 'antd';

export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (!error) {
    message.error('An unknown error occurred');
    return;
  }

  // Handle network errors
  if (!error.response) {
    message.error('Network error. Please check your connection.');
    return;
  }

  // Handle different HTTP status codes
  switch (error.response.status) {
    case 400:
      message.error(error.response.data?.message || 'Invalid request');
      break;
    case 401:
      message.error('Unauthorized. Please login again.');
      // You might want to redirect to login page or refresh token here
      break;
    case 403:
      message.error('You do not have permission to perform this action');
      break;
    case 404:
      message.error('Resource not found');
      break;
    case 422:
      message.error('Validation error');
      break;
    case 500:
      message.error('Internal server error. Please try again later.');
      break;
    default:
      message.error('Something went wrong. Please try again later.');
  }
};

export const wrapPromise = async (promise) => {
  try {
    const response = await promise;
    return response;
  } catch (error) {
    handleApiError(error);
    throw error; // Re-throw the error for the component to handle if needed
  }
}; 