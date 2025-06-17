import { useState, useEffect, useCallback } from "react";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/AuthController";
import { useNavigate } from "react-router-dom";
import NotificationPanel from "./Notifiation/NotificationPanel";
import { getNotifications } from "../redux/globalSlice";
import { Col } from "react-bootstrap";
import UserDropdown from "./menu";
import { useMediaQuery } from "react-responsive";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [isLogout, setLogout] = useState(true);
  console.log({isLogout})
  const [isNotifications, setNotifications] = useState(null);
  const [isUpdate, setUpdate] = useState(false);
  const [unReadCount, setUnReadCount] = useState(0);
  console.log(unReadCount)
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  console.log(isUpdate, setLogout);
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
        setUnReadCount(response.payload?.unReadCount);
      }
      setUpdate(true);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setUpdate(false);
    }
  }, [dispatch, setUnReadCount]);

  const handleNotificationPanel = async () => {
    await fetchNotificationsList();
    setUpdate(true);
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

        {isMobile ? <div className="input-group">
          {userAuth && (
            <span type="text" style={{ color: "#00ADEF", fontSize: '12px', margin: "0% 30%" }}>
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
        </div> : ''}
        {/* Topbar Navbar */}
        <ul className="navbar-nav ml-auto">
          <li className="nav-item dropdown no-arrow mx-1">
            <div
              className="dropdown dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="alertsDropdown"
            >
              <Col md={12} className="dropdown-header">
                Notification Center
              </Col>

              <Col md={12} style={{ maxHeight: "300px", overflowY: "auto" }}>
                {isNotifications && isNotifications.getRecord?.length > 0 ? (
                  <NotificationPanel
                    key={JSON.stringify(isNotifications)}
                    notifications={isNotifications}
                    handleNotificationPanel={handleNotificationPanel}
                    setUnReadCount={setUnReadCount}
                  />
                ) : (
                  <>
                    <span className="dropdown-item text-center small text-gray-500">
                      No notifications
                    </span>
                  </>
                )}
              </Col>
            </div>
          </li>

          {/* Nav Item - Messages */}
          <li className="nav-item dropdown no-arrow mx-1">
            <div
              className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="messagesDropdown"
            >
              <h6 className="dropdown-header">Message Center</h6>
              <a className="dropdown-item d-flex align-items-center" href="##">
                <div className="dropdown-list-image mr-3">
                  <img
                    className="rounded-circle"
                    src="img/undraw_profile_1.svg"
                    alt="..."
                  />
                  <div className="status-indicator bg-success"></div>
                </div>
                <div className="font-weight-bold">
                  <div className="text-truncate">
                    Hi there! I am wondering if you can help me with a problem
                    I've been having.
                  </div>
                  <div className="small text-gray-500">Emily Fowler · 58m</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="##">
                <div className="dropdown-list-image mr-3">
                  <img
                    className="rounded-circle"
                    src="img/undraw_profile_2.svg"
                    alt="..."
                  />
                  <div className="status-indicator"></div>
                </div>
                <div>
                  <div className="text-truncate">
                    I have the photos that you ordered last month, how would you
                    like them sent to you?
                  </div>
                  <div className="small text-gray-500">Jae Chun · 1d</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="##">
                <div className="dropdown-list-image mr-3">
                  <img
                    className="rounded-circle"
                    src="img/undraw_profile_3.svg"
                    alt="..."
                  />
                  <div className="status-indicator bg-warning"></div>
                </div>
                <div>
                  <div className="text-truncate">
                    Last month's report looks great, I am very happy with the
                    progress so far, keep up the good work!
                  </div>
                  <div className="small text-gray-500">Morgan Alvarez · 2d</div>
                </div>
              </a>
              <a className="dropdown-item d-flex align-items-center" href="##">
                <div className="dropdown-list-image mr-3">
                  <img
                    className="rounded-circle"
                    src="https://source.unsplash.com/Mv9hjnEUHR4/60x60"
                    alt="..."
                  />
                  <div className="status-indicator bg-success"></div>
                </div>
                <div>
                  <div className="text-truncate">
                    Am I a good boy? The reason I ask is because someone told me
                    that people say this to all dogs, even if they aren't
                    good...
                  </div>
                  <div className="small text-gray-500">
                    Chicken the Dog · 2w
                  </div>
                </div>
              </a>
              <a
                className="dropdown-item text-center small text-gray-500"
                href="##"
              >
                Read More Messages
              </a>
            </div>
          </li>

          <div className="topbar-divider d-none d-sm-block"></div>

          <UserDropdown userAuth={userAuth} setShowModal={setShowModal} />
        </ul>
      </nav>

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
