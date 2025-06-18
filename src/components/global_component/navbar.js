import { useState, useEffect } from "react";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/AuthController";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./Notifiation/NotificationPanel";
import { getNotifications } from "../redux/globalSlice";
import UserDropdown from "./menu";
import { useMediaQuery } from "react-responsive";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.authentication);
  const profileUser = useSelector((state) => state.profile.userData);
  const { notifications } = useSelector((state) => state.globalSlice);
  const [displayUser, setDisplayUser] = useState(profileUser);
  const [showNotifications, setShowNotifications] = useState(false);
  // Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        await dispatch(getNotifications()).unwrap();
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Set up interval for periodic fetching (every 30 seconds)
    const intervalId = setInterval(fetchNotifications, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Handle notification panel toggle
  const handleNotificationPanel = () => {
    setShowNotifications(!showNotifications);
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-dropdown')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showNotifications]);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleLogout = () => {
    dispatch(logoutAction())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const navStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#fff',
      gap: '16px',
      borderBottom: '1px solid #e3e6f0',
      marginBottom: '1.5rem',
      minHeight: '60px'
    },
    menuButton: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      color: '#01acee',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px'
    },
    welcomeText: {
      color: '#333',
      fontSize: '14px',
      fontWeight: 400,
      margin: 0,
      flex: 1,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    notificationArea: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    bellButton: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      position: 'relative'
    },
    bellIcon: {
      fontSize: '18px',
      color: '#01acee'
    },
    badge: {
      position: 'absolute',
      right: '-4px',
      top: '-4px',
      backgroundColor: '#dc3545',
      color: '#fff',
      borderRadius: '50%',
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 600,
      padding: '0 4px',
      zIndex: 1
    },
    dropdownMenu: {
      position: 'absolute',
      right: '-16px',
      top: '100%',
      width: isMobile ? 'calc(100vw - 32px)' : '320px',
      maxWidth: '400px',
      marginTop: '0.5rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      display: showNotifications ? 'block' : 'none',
      zIndex: 1000,
      overflow: 'hidden',
      border: '1px solid rgba(0, 0, 0, 0.1)'
    },
    dropdownHeader: {
      padding: '10px 16px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
      fontWeight: 600,
      color: '#01acee',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    notificationList: {
      maxHeight: isMobile ? 'calc(100vh - 250px)' : '400px',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      padding: '0'
    },
    noNotifications: {
      padding: '12px 16px',
      textAlign: 'center',
      color: '#666',
      fontSize: '13px',
      backgroundColor: '#f9f9f9'
    }
  };

  useEffect(() => {
    if (profileUser) {
      setDisplayUser(profileUser);
    }
  }, [profileUser]);

  console.log(notifications,'notifications')
  return (
    <>
      <div style={navStyles.container}>
        {/* Menu Button */}
       

        {/* Welcome Text */}
        {userAuth && (
          <div style={navStyles.welcomeText}>
            Welcome, <b>{userAuth.obj.companyName || `${displayUser?.firstName || userAuth.obj.firstName} ${displayUser?.lastName || userAuth.obj.lastName}`}</b>
          </div>
        )}

        {/* Notification Area */}
        <div style={navStyles.notificationArea}>
          <div className="notification-dropdown">
            <button style={navStyles.bellButton} onClick={handleNotificationPanel}>
              <i className="fas fa-bell fa-fw" style={navStyles.bellIcon}></i>
              {notifications?.unReadCount > 0 && (
                <span style={navStyles.badge}>
                  {notifications.unReadCount > 99 ? '99+' : notifications.unReadCount}
                </span>
              )}
            </button>
            <div style={navStyles.dropdownMenu}>
              <div style={navStyles.dropdownHeader}>
                Notification Center ({notifications?.unReadCount || 0})
              </div>
              <div style={navStyles.notificationList}>
                {notifications?.getRecord?.length > 0 ? (
                  <NotificationPanel
                    notifications={notifications}
                  />
                ) : (
                  <div style={navStyles.noNotifications}>
                    No notifications available
                  </div>
                )}
              </div>
            </div>
          </div>
          <UserDropdown userAuth={userAuth} setShowModal={setShowModal} />
        </div>
      </div>

      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        size="md"
        classes="logout-modal"
        body={
          <div style={{
            padding: '12px 32px 16px 32px',
            color: '#222',
            fontSize: '1.1rem',
            lineHeight: 1.6,
            textAlign: 'center',
          }}>
            Select <span style={{ color: '#335cad', fontWeight: 600, background: '#e6eaf2', padding: '2px 8px', borderRadius: 6 }}>
              "Logout"
            </span> if you are ready to end your current session.
          </div>
        }
        footer={
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 16,
            padding: '20px 32px 28px 32px',
            background: '#f8fafc',
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderTop: '1px solid #e6eaf2',
          }}>
            <button
              style={{
                minWidth: 110,
                padding: '10px 0',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                background: '#e6eaf2',
                color: '#335cad',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#d0d8e8')}
              onMouseOut={e => (e.currentTarget.style.background = '#e6eaf2')}
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              style={{
                minWidth: 110,
                padding: '10px 0',
                borderRadius: 8,
                fontWeight: 600,
                fontSize: '1rem',
                border: 'none',
                background: '#335cad',
                color: '#fff',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#274080')}
              onMouseOut={e => (e.currentTarget.style.background = '#335cad')}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        }
      />
    </>
  );
}

export default Navbar;
