import React, { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { notificationURL } from "../../../utils/envAccess";
import { useDispatch, useSelector } from "react-redux";
import { truncateText } from "../../../utils/globalFunctions";
import { toast } from "react-toastify";
import { markNotiAsRead } from "../../redux/globalSlice";

const NotificationPanel = ({
  notifications,
  handleNotificationPanel,
  setUnReadCount,
  onNotificationUpdate
}) => {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const { userAuth } = useSelector((state) => state?.authentication);

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

  const handleNotificationClick = async (message) => {
    if (message.isRead === 0) {
      try {
        const response = await dispatch(markNotiAsRead({ notiOrUser: "Noti", id: message.id })).unwrap();
        if (response?.status) {
          // Remove the message from the list
          setMessages(prevMessages => prevMessages.filter(msg => msg.id !== message.id));
          // Decrease unread count
          setUnReadCount(prevCount => Math.max(0, prevCount - 1));
          // Fetch latest notifications
          await onNotificationUpdate();
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        toast.error("Failed to mark notification as read");
      }
    }
  };

  const initializeSignalR = useCallback(async () => {
    const URL = `${notificationURL}notificationHub`;
    const connection = new signalR.HubConnectionBuilder().withUrl(URL).build();

    connection.on("ReceiveMessage", async (message, userId) => {
      try {
        if (userId) {
          const userIdsArray = JSON.parse(userId);
          userIdsArray.forEach((item) => {
            if (item === userAuth.id) {
              setMessages((prevMessages) => [...prevMessages, message]);
              // toast.info(message.description);
              setUnReadCount((prevCount) => prevCount + 1);
              // Fetch latest notifications when new message arrives
              onNotificationUpdate();
            }
          });
        }
      } catch (error) {
        console.log("error", error);
      }
    });

    try {
      await connection.start();
    } catch (err) {
      console.error(err.toString());
    }
  }, [userAuth.id, setUnReadCount, onNotificationUpdate]);

  const setMessagesFromNotifications = useCallback(() => {
    if (notifications?.getRecord?.length > 0) {
      setMessages(notifications.getRecord);
    } else {
      setMessages([]);
    }
  }, [notifications]);

  useEffect(() => {
    initializeSignalR();
  }, [initializeSignalR]);

  useEffect(() => {
    setMessagesFromNotifications();
  }, [setMessagesFromNotifications, notifications]);

  if (messages.length === 0) {
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

  return (
    <>
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          onClick={() => handleNotificationClick(message)}
          style={{
            padding: '8px 12px',
            borderBottom: '1px solid #eee',
            backgroundColor: message.isRead === 0 ? '#f8fbff' : '#fff',
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
                  color: getNotificationColor(message.title),
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  {message.title}
                </span>
                {message.isRead === 0 && (
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
                {truncateText(message.description, 10)}
              </p>
              <div style={{ 
                fontSize: '12px',
                color: '#999'
              }}>
                {new Date(message.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default NotificationPanel;
