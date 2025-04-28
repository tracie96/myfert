import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import { useSelector } from "react-redux";
import { Menu, Button, Drawer, Layout } from "antd";
import { useMediaQuery } from "react-responsive";
// Import React Icons
import { 
  FaQrcode, 
  FaPills, 
  FaChartPie, 
  FaFileAlt, 
  FaInfoCircle, 
  FaFlask, 
  FaInbox, 
  FaLink, 
  FaListOl, 
  FaBars, 
  FaServicestack,
  FaNotesMedical
} from "react-icons/fa";

export const GetSideBar = () => {
  const { userAuth } = useSelector((state) => state.authentication);
  const [visible, setVisible] = useState(false);
  const { Sider } = Layout;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
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
      case "/patient/appointment":
        return "10";
      case "/plans":
        return "7";
      case "/pre-plan":
        return "9";
      case "/second-plan":
        return "8";
      case "/patient/labs":
        return "9";
      case "/calendar":
        return "6";
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
      <Menu.Item key="6" icon={<FaServicestack style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/services" style={{ textDecoration: "none" }}>
          <span className="no-underline">SERVICES</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">NOTES</span>
        </NavLink>
        </Menu.Item>

        <Menu.Item key="7" icon={<FaNotesMedical style={{ color: "#00ADEF" }} />}>
        <NavLink to="/patient/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">DOCUMENTS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="8" icon={<FaInfoCircle style={{ color: "#00ADEF" }} />}>
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
      {/* <Menu.Item key="2" icon={<FaCalendarAlt style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">CALENDAR</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<FaListOl style={{ color: "#00ADEF" }} />}>
        <NavLink to="/doctor/appointments" style={{ textDecoration: "none" }}>
          <span>APPOINTMENTS</span>
        </NavLink>
      </Menu.Item> */}
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
