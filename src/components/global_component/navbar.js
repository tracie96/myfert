import { useState, useEffect, useCallback } from "react";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/AuthController";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./Notifiation/NotificationPanel";
import { getNotifications } from "../redux/globalSlice";
import UserDropdown from "./menu";
import { useMediaQuery } from "react-responsive";
import { BellOutlined } from '@ant-design/icons';

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [isNotifications, setNotifications] = useState(null);
  const [unReadCount, setUnReadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { userAuth } = useSelector((state) => state.authentication);
  const profileUser = useSelector((state) => state.profile.userData);
  const [displayUser, setDisplayUser] = useState(profileUser);

  useEffect(() => {
    if (profileUser) {
      setDisplayUser(profileUser);
    }
  }, [profileUser]);

  const dispatch = useDispatch();
  
  const fetchNotificationsList = useCallback(async () => {
    try {
      const response = await dispatch(getNotifications());
      if (getNotifications.fulfilled.match(response)) {
        setNotifications(response?.payload);
        setUnReadCount(response.payload?.unReadCount || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
    }
  }, [dispatch]);

  useEffect(() => {
    // Fetch notifications on component mount
    fetchNotificationsList();
    
    // Set up interval to fetch notifications every 30 seconds
    const interval = setInterval(fetchNotificationsList, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotificationsList]);

  const handleNotificationPanel = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      await fetchNotificationsList();
    }
  };

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

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top mt-3">
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group">
            {userAuth && (
              <span type="text" style={{ color: "#fff" }}>
                {userAuth.obj.companyName ? (
                  <>
                    <b>{userAuth.obj.companyName}</b>
                  </>
                ) : (
                  <>
                    Welcome,{" "}
                    <b>
                      {displayUser?.firstName || userAuth.obj.firstName} {displayUser?.lastName || userAuth.obj.lastName}
                    </b>
                  </>
                )}
              </span>
            )}
          </div>
        </form>

        {isMobile ? (
          <div className="input-group">
            {userAuth && (
              <span type="text" style={{ color: "#fff", fontSize: '12px', margin: "0% 30%" }}>
                {userAuth.obj.companyName ? (
                  <>
                    <b>{userAuth.obj.companyName}</b>
                  </>
                ) : (
                  <>
                    Welcome,{" "}
                    <b>
                      {displayUser?.firstName || userAuth.obj.firstName} {displayUser?.lastName || userAuth.obj.lastName}
                    </b>
                  </>
                )}
              </span>
            )}
          </div>
        ) : null}

        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown no-arrow mx-1">
            <div 
              className="nav-link dropdown-toggle" 
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={handleNotificationPanel}
            >
              <BellOutlined style={{ fontSize: '20px' }} />
              {unReadCount > 0 && (
                <span className="badge badge-danger badge-counter" style={{
                  position: 'absolute',
                  top: '25px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '0.25em 0.4em',
                  fontSize: '75%',
                  fontWeight: 700,
                  lineHeight: 1,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  verticalAlign: 'baseline'
                }}>
                  {unReadCount > 99 ? '99+' : unReadCount}
                </span>
              )}
            </div>
            
            {showNotifications && (
              <div
                className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in show"
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '100%',
                  zIndex: 1000,
                  minWidth: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  marginTop: '0.5rem'
                }}
              >
                <h6 className="dropdown-header" style={{
                  background: '#00ADEF',
                  color: 'white',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 600,
                  borderTopLeftRadius: '4px',
                  borderTopRightRadius: '4px',
                  margin: 0
                }}>
                  Notification Center
                </h6>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {isNotifications && isNotifications.getRecord?.length > 0 ? (
                    <NotificationPanel
                      key={JSON.stringify(isNotifications)}
                      notifications={isNotifications}
                      handleNotificationPanel={handleNotificationPanel}
                      setUnReadCount={setUnReadCount}
                      onNotificationUpdate={fetchNotificationsList}
                    />
                  ) : (
                    <div className="dropdown-item text-center small text-gray-500" style={{ padding: '16px' }}>
                      No notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </li>

          <div className="topbar-divider d-none d-sm-block"></div>
          <UserDropdown userAuth={userAuth} setShowModal={setShowModal} />
        </ul>
      </nav>

      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        size="md"
        classes="bg-primary py-2 text-white"
        title={  "Ready to Leave?"}
        body={
          <>
            Select "Logout" below if you are ready to end your current session.
          </>
        }
        footer={
          <>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleLogout}
              style={{ background: "#01ACEE" }}
            >
              Logout
            </button>
          </>
        }
      />
    </>
  );
}

export default Navbar;