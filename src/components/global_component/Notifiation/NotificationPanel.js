import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { notificationURL } from "../../../utils/envAccess";
import { useDispatch, useSelector } from "react-redux";
import { truncateText } from "../../../utils/globalFunctions";
import { Col, Row } from "react-bootstrap";
import { deleteRecord, markNotiAsRead } from "../../redux/globalSlice";
import { toast } from "react-toastify";

const NotificationPanel = ({
  notifications,
  handleNotificationPanel,
  setUnReadCount,
}) => {
  const [hubConnection, setHubConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isDisabled, setDisabled] = useState(false);
  const { userAuth } = useSelector((state) => state?.authentication);
  const dispatch = useDispatch();
console.log(hubConnection)
  useEffect(() => {
    const URL = `${notificationURL}notificationHub`;

    const initializeSignalR = async () => {
      const connection = new signalR.HubConnectionBuilder().withUrl(URL).build();

      connection.on("ReceiveMessage", (message, userId) => {
        try {
          if (userId) {
            const userIdsArray = JSON.parse(userId);
            userIdsArray.forEach((item) => {
              if (item === userAuth.id) {
                setMessages((prevMessages) => [...prevMessages, message]);
                toast.info(message.description);
                setUnReadCount((prevCount) => prevCount + 1);
              }
            });
          }
        } catch (error) {
          console.log("error", error);
        }
      });

      try {
        await connection.start();
        setHubConnection(connection);
      } catch (err) {
        console.error(err.toString());
      }
    };

    initializeSignalR();

    if (messages.length === 0 && notifications) {
      if (notifications?.getRecord?.length > 0) {
        setMessages(notifications.getRecord);
      }
    }
  }, [userAuth.id, notifications, setUnReadCount]);

  const markAsRead = async (values) => {
    setDisabled(true);
    try {
      const payload = {
        notiOrUser: "Noti",
        id: values, // assuming values is an object with an 'id' property
      };
      await dispatch(markNotiAsRead(payload));
      if (values.isRead === 0) {
        setUnReadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      }
    } catch (error) {
    } finally {
      setDisabled(false);
      handleNotificationPanel();
    }
  };

  const deleteNoti = async (id) => {
    setDisabled(true);
    try {
      const endPoint = `Notification/DeleteNoti?id=${id}`;
      await dispatch(deleteRecord(endPoint));
      setUnReadCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
    } catch (error) {
    } finally {
      setDisabled(false);
      handleNotificationPanel();
    }
  };

  return (
    <>
      {messages.map((message, index) => (
        <Row
          key={index}
          style={
            message.isRead === 0
              ? {
                  backgroundColor: "rgb(226 248 255)",
                  borderBottom: "1px solid #999",
                }
              : {
                  borderBottom: "1px solid rgb(227 227 227)",
                }
          }
        >
          <Col md={10}>
            <a
              href="##"
              className="dropdown-item align-items-center py-3 pe-1"
              style={{
                border: "1px solid transparent",
              }}
            >
              <h6 className="m-0 font-weight-bold text-primary">
                {message.title}
              </h6>
              <p className="text-gray-500" title={message.description}>
                {truncateText(message.description, 10)}
              </p>
            </a>
          </Col>
          <Col md={2} className="my-3">
            {message.isRead === 0 ? (
              <a
                href="##"
                title="Mark as read"
                disabled={isDisabled}
                onClick={() => markAsRead(message.id)}
              >
                <i className="fa fa-circle fa-solid fa-sm text-primary"></i>
              </a>
            ) : null}
            <a
              href="##"
              title="Delete"
              className="me-3"
              disabled={isDisabled}
              onClick={() => deleteNoti(message.id)}
            >
              <i className="fa fa-trash fa-solid fa-sm text-danger"></i>
            </a>
            <br />
          </Col>
        </Row>
      ))}
    </>
  );
};

export default NotificationPanel;
