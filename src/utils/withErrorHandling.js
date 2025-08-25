import React from 'react';
import { handleApiError } from './errorHandler';

export const withErrorHandling = (WrappedComponent) => {
  return class extends React.Component {
    state = {
      error: null
    };

    componentDidCatch(error, errorInfo) {
      console.error('Component Error:', error, errorInfo);
      this.setState({ error });
    }

    wrapApiCall = async (apiCall, ...args) => {
      try {
        const response = await apiCall(...args);
        if (!response.ok) {
          throw new Error('API call failed');
        }
        return await response.json();
      } catch (error) {
        handleApiError(error);
        throw error;
      }
    };

    render() {
      if (this.state.error) {
        return (
          <div className="error-container">
            <h2>Something went wrong</h2>
            <button onClick={() => window.location.reload()}>
              Refresh Page
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} wrapApiCall={this.wrapApiCall} />;
    }
  };
}; 