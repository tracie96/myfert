import { useEffect, useState } from "react";
import CustomModal from "./CustomModal";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../redux/AuthController";
import { NavLink } from "react-router-dom";
import defaultIconImage from "../../assets/images/users/user1.jpg";
import NotificationPanel from "./Notifiation/NotificationPanel";
import { getNotifications } from "../redux/globalSlice";
import { Col } from "react-bootstrap";

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [isLogout, setLogout] = useState(true);
  const [isNotifications, setNotifications] = useState(null);
  const [isUpdate, setUpdate] = useState(false);
  const [unReadCount, setUnReadCount] = useState(0);

console.log(setLogout,isUpdate)
  const { userAuth } = useSelector((state) => state.authentication);
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

  useEffect(() => {
    fetchNotificationsList();
  }, [fetchNotificationsList]);
  

  const handleNotificationPanel = async () => {
    await fetchNotificationsList();
    setUpdate(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* Sidebar Toggle (Topbar) */}
        <button
          id="sidebarToggleTop"
          className="btn btn-link d-md-none rounded-circle mr-3"
        >
          <i className="fa fa-bars"></i>
        </button>

        {/* Topbar Search */}
        <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search">
          <div className="input-group">
            {userAuth && (
              <span
                type="text"
                className="form-control bg-light border-0 small"
              >
                {userAuth.companyName ? (
                  <>
                    <b>{userAuth.companyName}</b>
                  </>
                ) : (
                  <>
                    Welcome,{" "}
                    <b>
                      {userAuth.firstName} {userAuth.lastName}
                    </b>
                  </>
                )}
              </span>
            )}

            {/* <div className="input-group-append">
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search fa-sm"></i>
              </button>
            </div> */}
          </div>
        </form>

        {/* Topbar Navbar */}
        <ul className="navbar-nav ml-auto">
          {/* Nav Item - Alerts */}
          <li className="nav-item dropdown no-arrow mx-1">
            <a
              className="nav-link dropdown-toggle"
              href="##"
              id="alertsDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i
                className="fas fa-bell fa-fw"
                onClick={() => fetchNotificationsList()}
              ></i>

              <span className="badge badge-danger badge-counter">
                {unReadCount > 9 ? `9+` : unReadCount}
              </span>
            </a>
            {/* Dropdown - Alerts */}
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
            <a
              className="nav-link dropdown-toggle"
              href="##"
              id="messagesDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fas fa-envelope fa-fw"></i>
              {/* Counter - Messages */}
              <span className="badge badge-danger badge-counter">7</span>
            </a>
            {/* Dropdown - Messages */}
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

          {/* Nav Item - User Information */}
          <li className="nav-item dropdown no-arrow">
            <a
              className="nav-link dropdown-toggle"
              href="##"
              id="userDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                className="img-profile rounded-circle"
                src={
                  // userAuth.profile ? userAuth.profile : "img/undraw_profile.svg"
                  userAuth.profile ? userAuth.profile : defaultIconImage
                }
                alt={userAuth.firstName}
              />
              <span className="ml-2 d-none d-lg-inline text-gray-600 small">
                {userAuth.firstName} {userAuth.lastName}
              </span>
              <i className="bi bi-caret-down-fill"></i>
            </a>
            {/* Dropdown - User Information */}
            <div
              className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
              aria-labelledby="userDropdown"
            >
              <NavLink to="/profile" className="dropdown-item" href="#">
                <i className="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
                Profile
              </NavLink>
              <NavLink to="/update-password" className="dropdown-item">
                <i className="fas fa-key fa-sm fa-fw mr-2 text-gray-400"></i>
                Update Password
              </NavLink>
              <NavLink to="/setting" className="dropdown-item">
                {/* <i className="fas fa-gear fa-sm fa-fw mr-2 text-gray-400"></i> */}
                <i className="bi bi-gear-fill mr-2 text-gray-400"></i>
                Settings
              </NavLink>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item"
                onClick={() => setShowModal(true)}
              >
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                Logout
              </button>
            </div>
          </li>
        </ul>
      </nav>

      <CustomModal
        show={showModal}
        onHide={handleCloseModal}
        size="md"
        classes="bg-primary py-2  text-white"
        title={isLogout ? "Ready to Leave?" : ""}
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
              onClick={() => dispatch(logoutAction())}
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
