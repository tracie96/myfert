import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import docDashBoardIcon from "../../assets/images/sidebar/docDashboardIcon.png";
import { useSelector } from "react-redux";
import { Menu, Button, Drawer, Layout } from "antd";
import {
  QrcodeOutlined,
  MenuOutlined,
  CalendarTwoTone,
  MedicineBoxTwoTone,
  PieChartTwoTone,
  FileAddTwoTone,
  InfoCircleTwoTone,
  ContactsTwoTone,
  ExperimentTwoTone,
  DiffTwoTone,
  InboxOutlined,
  LinkOutlined,
  OrderedListOutlined
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";


export const GetSideBar = () => {
  const { userAuth } = useSelector((state) => state.authentication);
  const [visible, setVisible] = useState(false);
  const { Sider } = Layout;
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const location = useLocation();
console.log(userAuth)
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
      <Menu.Item key="1" icon={<QrcodeOutlined />}>
        <NavLink to="/patient" style={{ textDecoration: "none" }}>
          <span>HOME</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<FileAddTwoTone />}>
        <NavLink to="/assessment" style={{ textDecoration: "none" }}>
          <span>ASSESS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<PieChartTwoTone />}>
        <NavLink to="/chart" style={{ textDecoration: "none" }}>
          <span className="no-underline">CHART</span>
        </NavLink>
      </Menu.Item>

      <Menu.Item key="5" icon={<MedicineBoxTwoTone />}>
      <NavLink to="/patient/meds" style={{ textDecoration: "none" }}>
        <span>MEDS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="9" icon={< DiffTwoTone />}>
        <NavLink to="/patient/labs" style={{ textDecoration: "none" }}>
          <span>LABS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<CalendarTwoTone />}>
        <NavLink to="/patient/calendar" style={{ textDecoration: "none" }}>
          <span className="no-underline">CALENDAR</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<ContactsTwoTone style={{ fontSize: '16px' }} />}>
        <NavLink to="/patient/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">APPOINTMENT</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="8" icon={<InfoCircleTwoTone />}>
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
      <Menu.Item key="1" icon={<OrderedListOutlined />}>
        <NavLink to="/doctor" style={{ textDecoration: "none" }}>
          <span>PATIENT LIST</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<CalendarTwoTone />}>
        <NavLink to="/doctor/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">CALENDAR</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<OrderedListOutlined />}>
        <NavLink to="/doctor/appointments" style={{ textDecoration: "none" }}>
          <span>APPOINTMENTS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="4" icon={<ExperimentTwoTone />}>
        <NavLink to="/doctor/labs" style={{ textDecoration: "none" }}>
          <span>LABS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="5" icon={<ExperimentTwoTone />}>
        <NavLink to="/doctor/meds" style={{ textDecoration: "none" }}>
          <span>MEDS</span>
        </NavLink>
      </Menu.Item>
    </Menu>
  );
  const nurseMenuItems = (
    <Menu
      theme="light"
      defaultSelectedKeys={["1"]}
      mode="inline"
      onClick={onClose}
    >
      <Menu.Item key="1" icon={<OrderedListOutlined />}>
        <NavLink to="/doctor" style={{ textDecoration: "none" }}>
          <span>PATIENT LIST</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<CalendarTwoTone />}>
        <NavLink to="/doctor/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">CALENDAR</span>
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
      <Menu.Item key="1" icon={<OrderedListOutlined />}>
        <NavLink to="/users" style={{ textDecoration: "none" }}>
          <span>PATIENT LIST</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="2" icon={<LinkOutlined />}>
        <NavLink to="/preview-link" style={{ textDecoration: "none" }}>
          <span className="no-underline">PREVIEW LINKS</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3" icon={<InboxOutlined />}>
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
                <MenuOutlined />
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
  } else if (userAuth.obj.role === "Doctor" || userAuth.obj.role === "FertilityEducator") {
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
                <MenuOutlined />
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
  } else if (userAuth.obj.role === "Nurse" || "Fertility Support Practitioner") {
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
                  top: 15,
                  left: 30,
                  zIndex: 9,
                }}
              >
                <MenuOutlined />
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
                {nurseMenuItems}
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
              {nurseMenuItems}
            </Sider>
          )}
        </div>
      </>
    );
  } else if (userAuth.obj.role === "Patient") {
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
              <MenuOutlined />
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
  } else {
    return (
      <>
        <ul
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

          {/* Divider */}
          <hr className="sidebar-divider my-0" />

          {/* empty */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/"></NavLink>
          </li>

          {/* Nav Item - Dashboard */}
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              <img
                src={docDashBoardIcon}
                alt="dashboard"
                style={{ width: "35px" }}
              ></img>
              <span className="pl-2">Dashboard</span>
            </NavLink>
          </li>

          {/* Nav Item - Add Company Collapse Menu */}
          {userAuth && !userAuth.obj.companyName ? (
            <>
              <li className="nav-item d-none">
                <a
                  className="nav-link collapsed"
                  href="/"
                  data-toggle="collapse"
                  data-target="#collapseMCompany"
                  aria-expanded="true"
                  aria-controls="collapseMCompany"
                >
                  <i className="fas fa-fw fa-university"></i>
                  <span>Manage Compnay</span>
                </a>
                <div
                  id="collapseMCompany"
                  className="collapse"
                  aria-labelledby="headingMCompany"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    <NavLink className="collapse-item" to="add-company">
                      Add Company
                    </NavLink>
                    <div className="collapse-divider"></div>
                    <NavLink className="collapse-item" to="company-list">
                      Company List
                    </NavLink>
                  </div>
                </div>
              </li>
            </>
          ) : (
            ""
          )}

          {/* Divider */}
          <hr className="sidebar-divider d-none d-md-block" />

          <div className="text-center d-none d-md-inline">
            <button
              className="rounded-circle border-0"
              id="sidebarToggle"
            ></button>
          </div>
        </ul>
      </>
    );
  }
};
