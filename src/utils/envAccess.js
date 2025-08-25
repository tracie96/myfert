const getEnvironment = () => {
  if (typeof window !== 'undefined' && window.location.href.includes('myfert-dev.netlify.app/')) {
    return 'development';
  }
  return process.env.NODE_ENV || 'development';
};

const env = getEnvironment(); 

export const baseUrl = env === 'production' 
  ? 'https://confident-einstein.74-50-88-98.plesk.page/api/'
  : 'https://confident-einstein.74-50-88-98.plesk.page/api/';

export const getBaseUrl = () => baseUrl;

export const notificationURL = process.env.REACT_APP_API_Notification_URL;
export const Key = process.env.REACT_APP_API_MAP_KEY;
