const getEnvironment = () => {
  if (typeof window !== 'undefined' && window.location.href.includes('myfertility.netlify.app/')) {
    return 'development';
  }
  return process.env.NODE_ENV || 'development';
};

const env = getEnvironment();

export const baseUrl = env === 'production' 
  ? 'https://myfertilitydevapi-prod.azurewebsites.net/api/'
  : 'https://myfertilitydevapi.azurewebsites.net/api/';

export const getBaseUrl = () => baseUrl;

export const notificationURL = process.env.REACT_APP_API_Notification_URL;
export const Key = process.env.REACT_APP_API_MAP_KEY;
