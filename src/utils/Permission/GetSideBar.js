import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import { useSelector } from "react-redux";
import { Menu, Button, Drawer, Layout, Modal } from "antd";
import { useMediaQuery } from "react-responsive";
// Import React Icons
import { 
  FaQrcode, 
  FaPills, 
  FaChartPie, 
  FaFileAlt, 
  FaFlask, 
  FaInbox, 
  FaLink, 
  FaListOl, 
  FaBars, 
  FaServicestack,
  FaBook,
  FaSignOutAlt,
  FaStickyNote,
} from "react-icons/fa";
import { FaNotesMedical } from "react-icons/fa";
export const GetSideBar = () => {
  const { userAuth } = useSelector((state) => state.authentication);
  const accessDetails = useSelector((state) => state.intake.accessDetails);
  const [visible, setVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { Sider } = Layout;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
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
      case "/admin":
        return "1";
      case "/preview-link":
        return "2";
      case "/inbox":
        return "3";

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
        <NavLink to="/patient/meds" style={{ textDecoration: "none" }}>
          <span>MEDS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="9" icon={<FaFlask style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/labs" style={{ textDecoration: "none" }}>
          <span>LABS</span>
        </NavLink>
      </Menu.Item>

      <Menu.Item key="10" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/notes" style={{ textDecoration: "none" }}>
          <span>NOTES</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="11" icon={<FaPills style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/supplements" style={{ textDecoration: "none" }}>
          <span>SUPPLEMENTS</span>
        </NavLink>
      </Menu.Item>

      {getAccessDetailsStatus() && userAuth?.obj?.videoWatched && (
        <Menu.Item key="6" icon={<FaServicestack style={{ color: "#00ADEF" }} />}>
          <NavLink to="/patient/services" style={{ textDecoration: "none" }}>
            <span className="no-underline">SERVICES</span>
          </NavLink>
        </Menu.Item>
      )}

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
      <Menu.Item key="4" icon={<FaFlask style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/labs" style={{ textDecoration: "none" }}>
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
      <Menu.Item key="8" icon={<FaStickyNote style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/fax" style={{ textDecoration: "none" }}>
          <span>FAX</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="9" icon={<FaStickyNote style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/intercom" style={{ textDecoration: "none" }}>
          <span>INTERCOM</span>
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
    >
      <Menu.Item key="1" icon={<FaListOl style={{ color: "#00ADEF" }} />}>
        <NavLink to="/users" style={{ textDecoration: "none" }}>
          <span>PATIENT LIST</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<FaLink style={{ color: "#00ADEF" }} />}>
        <NavLink to="/preview-link" style={{ textDecoration: "none" }}>
          <span className="no-underline">PREVIEW LINKS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<FaInbox style={{ color: "#00ADEF" }} />}>
        <NavLink to="/inbox" style={{ textDecoration: "none" }}>
          <span className="no-underline">INBOX</span>
        </NavLink>
      </Menu.Item>
    </Menu>
  );


  if (userAuth.obj.role === "SuperAdmin") {
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
   else if (userAuth.obj.role === "Doctor" || userAuth.obj.role === "FertilityEducator") {
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

  else if (userAuth.obj.role === "Patient") {
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
