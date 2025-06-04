const env = process.env.NODE_ENV || 'development';

export const baseUrl = env === 'production' 
  ? 'https://myfertilitydevapi-prod.azurewebsites.net/api/'
  : 'https://myfertilitydevapi.azurewebsites.net/api/';

export const getBaseUrl = () => baseUrl;

export const notificationURL = process.env.REACT_APP_API_Notification_URL;
export const Key = process.env.REACT_APP_API_MAP_KEY;
