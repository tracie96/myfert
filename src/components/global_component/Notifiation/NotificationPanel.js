import React from "react";

const NotificationPanel = ({ notifications }) => {
  const notificationsList = notifications?.getRecord || [];
  
  if (notificationsList.length === 0) {
    return (
      <div style={{
        padding: '12px',
        textAlign: 'center',
        color: '#666',
        fontSize: '13px'
      }}>
        No notifications available
      </div>
    );
  }

  const getNotificationColor = (type) => {
    const colors = {
      'LabRequisition': '#4169E1',
      'LabWork': '#4169E1',
      'DrugSupplement': '#2E8B57',
      'PatientNote': '#9370DB',
      'LaboratoryDocument': '#4169E1',
      'default': '#01acee'
    };
    return colors[type] || colors.default;
  };

  return (
    <>
      {notificationsList.map((notification) => (
        <div
          key={notification.id}
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #eee',
            backgroundColor: notification.isRead === 0 ? '#f8fbff' : '#fff',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginBottom: '4px'
              }}>
                <span style={{ 
                  color: getNotificationColor(notification.title),
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  {notification.title}
                </span>
                {notification.isRead === 0 && (
                  <span style={{ 
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#01acee',
                    display: 'inline-block'
                  }}/>
                )}
              </div>
              <p style={{ 
                margin: '0 0 4px',
                color: '#666',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {notification.description}
              </p>
              <div style={{ 
                fontSize: '12px',
                color: '#999'
              }}>
                {new Date(notification.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationPanel;
