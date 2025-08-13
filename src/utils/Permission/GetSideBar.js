import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useLocation } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Button, Drawer, Layout, Modal, Badge } from "antd";
import { useMediaQuery } from "react-responsive";
import { getUnreadMessageCount } from "../../components/redux/doctorSlice";
import { getNotifications, markNotiAsRead } from "../../components/redux/globalSlice";
// Import React Icons
import {
  FaQrcode,
  FaPills,
  FaChartPie,
  FaFileAlt,
  FaFlask,
  FaInbox,
  FaListOl,
  FaBars,
  FaServicestack,
  FaBook,
  FaSignOutAlt,
  FaStickyNote,
} from "react-icons/fa";

import { FaNotesMedical } from "react-icons/fa";
export const GetSideBar = () => {
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.doctor.unreadMessageCount);
  const { userAuth } = useSelector((state) => state.authentication);
  const accessDetails = useSelector((state) => state.intake.accessDetails);
  const [notifications, setNotifications] = useState(null);

  // Add CSS for notification badge animation
 
  const [visible, setVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notificationBadges, setNotificationBadges] = useState({
    labs: 0,
    meds: 0,
    supplements: 0,
    notes: 0,
    appointments: 0
  });
  const { Sider } = Layout;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();

  // Function to categorize notifications by type
  const categorizeNotifications = (notifications) => {
    // Check both possible data structures
    const notificationRecords = notifications?.data?.getRecord || notifications?.getRecord;
    if (!notificationRecords) return { labs: 0, meds: 0, supplements: 0, notes: 0, appointments: 0 };
    
    const badges = { labs: 0, meds: 0, supplements: 0, notes: 0, appointments: 0 };
    
    console.log('🔍 Processing notifications:', notificationRecords);
    console.log('🔍 Total notifications to process:', notificationRecords.length);
    
    notificationRecords.forEach((notification, index) => {
      console.log(`📋 Processing notification ${index + 1}:`, {
        id: notification.id,
        title: notification.title,
        description: notification.description,
        isRead: notification.isRead
      });
      
      if (notification.isRead === 0) { // Only count unread notifications
        const title = notification.title;
        const description = notification.description || '';
        
        console.log(`📋 Unread notification: ${title} - ${description} (isRead: ${notification.isRead})`);
        
        // Lab notifications - use title
        if (title === "LabWork" || title === "LabRequisition") {
          badges.labs++;
          console.log('✅ Categorized as LABS');
        }
        // Medication notifications - use description for "Drug Medications" and title for "Prescription"
        else if (description === "Drug Medications has been prescribed to you") {
          badges.meds++;
          console.log('✅ Categorized as MEDS');
        }
        // Supplement notifications - use description
        else if (description.includes("Drug Supplements has been prescribed")) {
          badges.supplements++;
          console.log('✅ Categorized as SUPPLEMENTS');
        }
        // Patient note notifications - use title
        else if (title === "PatientNote") {
          badges.notes++;
          console.log('✅ Categorized as NOTES');
        }
        // Appointment notifications
        else if (title === "Appointment" || description.includes("appointment") || description.includes("schedule")) {
          badges.appointments++;
          console.log('✅ Categorized as APPOINTMENTS');
        }
        else {
          console.log('❌ No category matched for unread notification');
        }
      } else {
        console.log(`📋 Skipping read notification: ${notification.title}`);
      }
    });
    
    console.log('🏷️ Final badge counts:', badges);
    return badges;
  };

  // Function to clear badge when menu item is clicked
  const clearBadge = async (badgeType) => {
    setNotificationBadges(prev => ({
      ...prev,
      [badgeType]: 0
    }));

    // Mark notifications as read based on type
    const notificationRecords = notifications?.data?.getRecord || notifications?.getRecord;
    if (notificationRecords) {
      const notificationsToMark = notificationRecords.filter(notification => {
        if (notification.isRead === 0) {
          const title = notification.title;
          const description = notification.description || '';
          
          switch (badgeType) {
            case 'labs':
              return title === "LabWork" || title === "LabRequisition";
            case 'meds':
              return description === "Drug Medications has been prescribed to you";
            case 'supplements':
              return description.includes("Drug Supplements has been prescribed");
            case 'notes':
              return title === "PatientNote";
            case 'appointments':
              return title === "Appointment" || description.includes("appointment") || description.includes("schedule");
            default:
              return false;
          }
        }
        return false;
      });

      // Mark each notification as read
      for (const notification of notificationsToMark) {
        try {
          await dispatch(markNotiAsRead({ notiOrUser: "Noti", id: notification.id }));
        } catch (error) {
          console.error('Error marking notification as read:', error);
        }
      }

      // Refresh notifications after marking as read
      await fetchNotifications();
    }
  };

  useEffect(() => {
    if (notifications) {
      console.log('🔄 Notifications changed:', notifications);
      const badges = categorizeNotifications(notifications);
      console.log('🎯 Setting notification badges:', badges);
      setNotificationBadges(badges);
    } else {
      console.log('❌ No notifications available');
    }
  }, [notifications]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      console.log('🔄 Fetching notifications...');
      const response = await dispatch(getNotifications());
      if (getNotifications.fulfilled.match(response)) {
        console.log('📥 Fetched notifications:', response.payload);
        setNotifications(response.payload);
      } else {
        console.log('❌ Failed to fetch notifications:', response);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [dispatch]);


  // Fetch unread message count
  const fetchUnreadCount = useCallback(async () => {
    try {
      await dispatch(getUnreadMessageCount());
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;
    
    // Initial fetches
    const initialFetch = async () => {
      if (isMounted) {
        await fetchUnreadCount();
        await fetchNotifications();
      }
    };
    
    initialFetch();
    
    // Set up interval to fetch notifications and unread count every 10 seconds (temporarily reduced for testing)
    const pollingInterval = setInterval(() => {
      if (isMounted) {
        fetchUnreadCount();
        fetchNotifications(); 
      }
    }, 10000);

    // Cleanup function
    return () => {
      isMounted = false;
      clearInterval(pollingInterval);
    };
  }, [fetchNotifications, fetchUnreadCount]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleLogout = () => {
    // Add your logout logic here
    localStorage.clear();
    window.location.href = "/";
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/patient":
        return "1";
      case "/assessment":
        return "2";
      case "/chart":
        return "3";
      case "/patient/meds":
        return "5";
      case "/learn":
        return "8";
      case "/patient/labs":
        return "9";
      case "/patient/services":
        return "6";
      case "/patient/supplements":
        return "11";
      case "/patient/notes":
        return "10"
      case "/patient/intercoms":
        return "12"
      default:
        return "1";
    }
  };

  const getSelectedDoctorKey = () => {
    switch (location.pathname) {
      case "/doctor":
        return "1";
      case "/doctor/appointment":
        return "2";
      case "/doctor/appointments":
        return "3";
        case "/doctor/chart":
        return "12";
      case "/doctor/labs":
        return "4";
      case "/doctor/meds":
        return "5";
      case "/doctor/notes":
        return "6";
      case "/doctor/fax":
        return "8";
      case "/doctor/intercom":
        return "9";
      default:
        return "1";
    }
  };

  const getSelectedAdminKey = () => {
    switch (location.pathname) {
      case "/users":
        return "1";
      case "/logs":
        return "2";
      case "/statistics":
        return "3";
      case "/ticketing":
        return "4";
      case "/assignment":
        return "6";
      default:
        return "1";
    }
  };

  const getAccessDetailsStatus = () => {
    if (!accessDetails) return false;
    return Object.values(accessDetails).every(value => value === true);
  };

  const menuItems = (
    <Menu
      theme="light"
      selectedKeys={[getSelectedKey()]}
      mode="inline"
      onClick={onClose}
    >
      {console.log('🎨 Rendering menu with badges:', notificationBadges)}
      <Menu.Item key="1" icon={<FaQrcode style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient" style={{ textDecoration: "none" }}>
          <span>HOME</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<FaFileAlt style={{ color: "#00ADEF" }} />}>
        <NavLink to="/assessment" style={{ textDecoration: "none" }}>
          <span>ASSESS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<FaChartPie style={{ color: "#00ADEF" }} />}>
        <NavLink to="/chart" style={{ textDecoration: "none" }}>
          <span className="no-underline">CHART</span>
        </NavLink>
      </Menu.Item>

      <Menu.Item key="5" icon={<FaPills style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/meds" style={{ textDecoration: "none" }} onClick={async (e) => {
          if (notificationBadges.meds > 0) {
            e.preventDefault();
            await clearBadge('meds');
            // Navigate after clearing the badge
            window.location.href = "/patient/meds";
          }
        }}>
          {notificationBadges.meds > 0 ? (
            <Badge 
              count={notificationBadges.meds} 
              offset={[10, 0]} 
              className="notification-badge"
              style={{ 
                backgroundColor: '#ff4d4f',
                fontSize: '8px',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                padding: '0 4px'
              }}
            >
              <span>MEDS</span>
            </Badge>
          ) : (
            <span>MEDS</span>
          )}
        </NavLink>
     
      </Menu.Item>
      <Menu.Item key="9" icon={<FaFlask style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/labs" style={{ textDecoration: "none" }} onClick={async (e) => {
          if (notificationBadges.labs > 0) {
            e.preventDefault();
            await clearBadge('labs');
            // Navigate after clearing the badge
            window.location.href = "/patient/labs";
          }
        }}>
          {notificationBadges.labs > 0 ? (
            <Badge 
              count={notificationBadges.labs} 
              offset={[10, 0]} 
              className="notification-badge"
              style={{ 
                backgroundColor: '#ff4d4f',
                fontSize: '8px',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                padding: '0 4px'
              }}
            >
              <span>LABS</span>
            </Badge>
          ) : (
            <span>LABS</span>
          )}
        </NavLink>
      </Menu.Item>

      <Menu.Item key="10" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/notes" style={{ textDecoration: "none" }} onClick={async (e) => {
          if (notificationBadges.notes > 0) {
            e.preventDefault();
            await clearBadge('notes');
            // Navigate after clearing the badge
            window.location.href = "/patient/notes";
          }
        }}>
          {notificationBadges.notes > 0 ? (
            <Badge 
              count={notificationBadges.notes} 
              offset={[10, 0]} 
              className="notification-badge"
              style={{ 
                backgroundColor: '#ff4d4f',
                fontSize: '8px',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                padding: '0 4px'
              }}
            >
              <span>NOTES</span>
            </Badge>
          ) : (
            <span>NOTES</span>
          )}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="11" icon={<FaPills style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/supplements" style={{ textDecoration: "none" }} onClick={async (e) => {
          if (notificationBadges.supplements > 0) {
            e.preventDefault();
            await clearBadge('supplements');
            // Navigate after clearing the badge
            window.location.href = "/patient/supplements";
          }
        }}>
          {notificationBadges.supplements > 0 ? (
            <Badge 
              count={notificationBadges.supplements} 
              offset={[10, 0]} 
              className="notification-badge"
              style={{ 
                backgroundColor: '#ff4d4f',
                  fontSize: '8px',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                padding: '0 4px'
              }}
            >
              <span>SUPPLEMENTS</span>
            </Badge>
          ) : (
            <span>SUPPLEMENTS</span>
          )}
        </NavLink>
      </Menu.Item>
      {getAccessDetailsStatus() && userAuth?.obj?.videoWatched && (
        <Menu.Item key="6" icon={<FaServicestack style={{ color: "#00ADEF" }} />}>
          <NavLink to="/patient/services" style={{ textDecoration: "none" }}>
            <span className="no-underline">SERVICES</span>
          </NavLink>
        </Menu.Item>
      )}
      <Menu.Item key="12" icon={<FaStickyNote style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/intercoms" style={{ textDecoration: "none" }}>
          {unreadCount ? (
            <Badge 
              dot 
              offset={[3, 0]} 
              className="notification-badge"
              style={{ 
                backgroundColor: '#ff4d4f',
                fontSize: '8px',
                minWidth: '12px',
                height: '12px',
                lineHeight: '12px',
                padding: '0 4px'
              }}
            >
              <span className="no-underline">INTERCOMS</span>
            </Badge>
          ) : (
            <span className="no-underline">INTERCOMS</span>
          )}
        </NavLink>
      </Menu.Item>
      <Menu.Item key="8" icon={<FaBook style={{ color: "#00ADEF" }} />}>
        <NavLink to="/learn" style={{ textDecoration: "none" }}>
          <span className="no-underline">LEARN</span>
        </NavLink>
      </Menu.Item>
    </Menu>
  );
  const doctorMenuItems = (
    <Menu
      theme="light"
      selectedKeys={[getSelectedDoctorKey()]}
      mode="inline"
      onClick={onClose}
    >
      <Menu.Item key="1" icon={<FaListOl style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor" style={{ textDecoration: "none" }}>
          <span>PATIENT LIST</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="12" icon={<FaFlask style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/chart" style={{ textDecoration: "none" }}>
          <span>CHART</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="4" icon={<FaFlask style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/labs" style={{ textDecoration: "none" }} >
         
            <span>LABS</span>
     
        </NavLink>
      </Menu.Item>
      <Menu.Item key="5" icon={<FaPills style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/meds" style={{ textDecoration: "none" }}>
            <span>MEDS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/notes" style={{ textDecoration: "none" }}>
          <span>NOTES</span>
        </NavLink>
      </Menu.Item>
      {/* <Menu.Item key="8" icon={<FaStickyNote style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/fax" style={{ textDecoration: "none" }}>
          <span>FAX</span>
        </NavLink>
      </Menu.Item> */}
      <Menu.Item key="9" icon={<FaStickyNote style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/intercom" style={{ textDecoration: "none" }}>
          {unreadCount ? (
            <Badge dot offset={[5, 0]} style={{ backgroundColor: '#ff4d4f' }}>
              <span className="no-underline">INTERCOMS</span>
            </Badge>
          ) : (
            <span className="no-underline">INTERCOMS</span>
          )}
        </NavLink>
      </Menu.Item>
        <Menu.Item
        key="7"
        icon={<FaSignOutAlt style={{ color: "#00ADEF" }} />}
        onClick={() => setShowLogoutModal(true)}
      >
        <span>LOGOUT</span>
      </Menu.Item>
    </Menu>
  );


  const adminMenuItems = (
    <Menu
      theme="light"
      selectedKeys={[getSelectedAdminKey()]}
      mode="inline"
      onClick={onClose}
      style={{ fontSize: '14px' }}
    >
      <Menu.Item key="1" icon={<FaListOl style={{ color: "#00ADEF" }} />}>
        <NavLink to="/users" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>USER MANAGEMENT</span>
        </NavLink>
      </Menu.Item>
      {/* <Menu.Item key="2" icon={<FaFileAlt style={{ color: "#00ADEF" }} />}>
        <NavLink to="/log" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>LOGS</span>
        </NavLink>
      </Menu.Item> */}
      <Menu.Item key="3" icon={<FaChartPie style={{ color: "#00ADEF" }} />}>
        <NavLink to="/statistics" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>STATISTICS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="4" icon={<FaInbox style={{ color: "#00ADEF" }} />}>
        <NavLink to="/ticketing" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>TICKETING SYSTEM</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="5" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/admin/fax" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>FAX</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<FaServicestack style={{ color: "#00ADEF" }} />}>
        <NavLink to="/assignment" style={{ textDecoration: "none" }}>
          <span style={{ whiteSpace: 'normal', lineHeight: '1.2' }}>ASSIGNMENT OF CARE</span>
        </NavLink>
      </Menu.Item>
    </Menu>
  );


  if (userAuth?.obj?.role === "SuperAdmin") {
    return (
      <>
        <div>
          {isMobile ? (
            <>
              <Button
                type="primary"
                onClick={showDrawer}
                className="sidebar-toggle"
                style={{
                  marginBottom: 16,
                  position: "absolute",
                  top: 30,
                  left: 30,
                  zIndex: 9,
                  background: "none",
                  color: "#00ADEF"
                }}
              >
                <FaBars style={{ color: "#00ADEF" }} />
              </Button>
              <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ padding: 0 }}
                width={280}
              >
                <NavLink
                  className="sidebar-brand d-flex align-items-center justify-content-center"
                  to="/"
                  onClick={onClose}
                >
                  <div className="sidebar-brand-text mx-3">
                    <NavLink className="text-white" to="/">
                      <img
                        src={fertilityImage}
                        alt="logo"
                        style={{ width: "100%" }}
                      />
                    </NavLink>
                  </div>
                </NavLink>
                {adminMenuItems}
              </Drawer>
            </>
          ) : (
            <Sider
              collapsible
              breakpoint="xs"
              collapsedWidth={0}
              trigger={null}
              theme="light"
              className="navbar-nav sidebar sidebar-light accordion"
              id="accordionSidebar"
              width={280}
            >
              <NavLink
                className="sidebar-brand d-flex align-items-center justify-content-center"
                to="/"
              >
                <div className="sidebar-brand-text  mx-3">
                  <NavLink className="text-white" to="/">
                    <img
                      src={fertilityImage}
                      alt="logo"
                      style={{ width: "100%" }}
                    />
                  </NavLink>
                </div>
              </NavLink>
              {adminMenuItems}
            </Sider>
          )}
        </div>
      </>
    );
  }
  else if (userAuth?.obj?.role === "Doctor" || userAuth?.obj?.role === "FertilityEducator") {
    return (
      <>
        <div>
          {isMobile ? (
            <>
              <Button
                type="primary"
                onClick={showDrawer}
                className="sidebar-toggle"
                style={{
                  marginBottom: 16,
                  position: "absolute",
                  top: 30,
                  left: 30,
                  zIndex: 9,
                  background: "none",
                  color: "#00ADEF"
                }}
              >
                <FaBars style={{ color: "#00ADEF" }} />
              </Button>
              <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ padding: 0 }}
                width={250}
              >
                <NavLink
                  className="sidebar-brand d-flex align-items-center justify-content-center"
                  to="/"
                  onClick={onClose}
                >
                  <div className="sidebar-brand-text mx-3">
                    <NavLink className="text-white" to="/">
                      <img
                        src={fertilityImage}
                        alt="logo"
                        style={{ width: "100%" }}
                      />
                    </NavLink>
                  </div>
                </NavLink>
                {doctorMenuItems}
              </Drawer>
            </>
          ) : (
            <Sider
              collapsible
              breakpoint="xs"
              collapsedWidth={0}
              trigger={null}
              theme="light"
              className="navbar-nav sidebar sidebar-light accordion"
              id="accordionSidebar"
            >
              <NavLink
                className="sidebar-brand d-flex align-items-center justify-content-center"
                to="/"
              >
                <div className="sidebar-brand-text  mx-3">
                  <NavLink className="text-white" to="/">
                    <img
                      src={fertilityImage}
                      alt="logo"
                      style={{ width: "100%" }}
                    />
                  </NavLink>
                </div>
              </NavLink>
              {doctorMenuItems}
            </Sider>
          )}
          <Modal
            open={showLogoutModal}
            onCancel={handleCloseLogoutModal}
            footer={null}
            centered
          >
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
                onClick={handleCloseLogoutModal}
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
          </Modal>
        </div>
      </>
    );
  }

  else if (userAuth?.obj?.role === "Patient") {
    return (
      <div>
        {isMobile ? (
          <>
            <Button
              type="primary"
              onClick={showDrawer}
              className="sidebar-toggle"
              style={{
                marginBottom: 16,
                position: "absolute",
                top: 30,
                left: 30,
                zIndex: 9,
                background: "none",
                color: "#00ADEF"
              }}
            >
              <FaBars style={{ color: "#00ADEF" }} />
            </Button>
            <Drawer
              placement="left"
              closable={false}
              onClose={onClose}
              visible={visible}
              bodyStyle={{ padding: 0 }}
              width={250} // Set the width of the Drawer here
            >
              <NavLink
                className="sidebar-brand d-flex align-items-center justify-content-center"
                to="/"
                onClick={onClose}
              >
                <div className="sidebar-brand-text mx-3">
                  <NavLink className="text-white" to="/">
                    <img
                      src={fertilityImage}
                      alt="logo"
                      style={{ width: "100%" }}
                    />
                  </NavLink>
                </div>
              </NavLink>
              {menuItems}
            </Drawer>
          </>
        ) : (
          <Sider
            collapsible
            breakpoint="xs"
            collapsedWidth={0}
            trigger={null}
            theme="light"
            className="navbar-nav sidebar sidebar-light accordion"
            id="accordionSidebar"
          >
            <NavLink
              className="sidebar-brand d-flex align-items-center justify-content-center"
              to="/"
            >
              <div className="sidebar-brand-text  mx-3">
                <NavLink className="text-white" to="/">
                  <img
                    src={fertilityImage}
                    alt="logo"
                    style={{ width: "100%" }}
                  />
                </NavLink>
              </div>
            </NavLink>
            {menuItems}
          </Sider>
        )}
      </div>
    );
  }
  else {
    return (
      <>
        <div>
          {isMobile ? (
            <>
              <Button
                type="primary"
                onClick={showDrawer}
                className="sidebar-toggle"
                style={{
                  marginBottom: 16,
                  position: "absolute",
                  top: 30,
                  left: 30,
                  zIndex: 9,
                  background: "none",
                  color: "#00ADEF"
                }}
              >
                <FaBars style={{ color: "#00ADEF" }} />
              </Button>
              <Drawer
                placement="left"
                closable={false}
                onClose={onClose}
                visible={visible}
                bodyStyle={{ padding: 0 }}
                width={250}
              >
                <NavLink
                  className="sidebar-brand d-flex align-items-center justify-content-center"
                  to="/"
                  onClick={onClose}
                >
                  <div className="sidebar-brand-text mx-3">
                    <NavLink className="text-white" to="/">
                      <img
                        src={fertilityImage}
                        alt="logo"
                        style={{ width: "100%" }}
                      />
                    </NavLink>
                  </div>
                </NavLink>
                {doctorMenuItems}
              </Drawer>
            </>
          ) : (
            <Sider
              collapsible
              breakpoint="xs"
              collapsedWidth={0}
              trigger={null}
              theme="light"
              className="navbar-nav sidebar sidebar-light accordion"
              id="accordionSidebar"
            >
              <NavLink
                className="sidebar-brand d-flex align-items-center justify-content-center"
                to="/"
              >
                <div className="sidebar-brand-text  mx-3">
                  <NavLink className="text-white" to="/">
                    <img
                      src={fertilityImage}
                      alt="logo"
                      style={{ width: "100%" }}
                    />
                  </NavLink>
                </div>
              </NavLink>
              {doctorMenuItems}
            </Sider>
          )}
        </div>
      </>
    );
  }
};
