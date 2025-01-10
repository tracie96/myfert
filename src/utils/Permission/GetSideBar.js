import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import docDashBoardIcon from "../../assets/images/sidebar/docDashboardIcon.png";
import usersIcon from "../../assets/images/sidebar/usersIcon.png";
import { useSelector } from "react-redux";
import { Menu, Button, Drawer, Layout } from "antd";
import {
  QrcodeOutlined,
  MenuOutlined,
  CalendarTwoTone,
  MedicineBoxTwoTone,
  PieChartTwoTone,
  FileAddTwoTone,
  OrderedListOutlined,
  InfoCircleTwoTone,
  ContactsTwoTone 
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

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
      case "/patient/appointment":
        return "10";
      case "/plans":
        return "7";
      case "/second-plan":
        return "8";
      case "/pre-plan":
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
        <span>MEDS</span>
      </Menu.Item>
      <Menu.Item key="6" icon={<CalendarTwoTone />}>
        <NavLink to="/patient/calendar" style={{ textDecoration: "none" }}>
          <span className="no-underline">CALENDAR</span>
        </NavLink>
      </Menu.Item>
      <Menu.Item key="6" icon={<ContactsTwoTone style={{ fontSize: '16px'}} />}>
        <NavLink to="/patient/appointment" style={{ textDecoration: "none" }}>
          <span className="no-underline">APPOINTMENT</span>
        </NavLink>
      </Menu.Item>
      {/* <Menu.Item key="7" icon={<PlayCircleTwoTone />}>
        <NavLink to="/plans" style={{ textDecoration: "none" }}>
          <span className="no-underline">PLANS</span>
        </NavLink>
      </Menu.Item> */}
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

  if (userAuth.obj.role === "SuperAdmin") {
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

          <li className="nav-item">
            <NavLink className="nav-link" to="/users">
              <img
                src={usersIcon}
                alt="dashboard"
                style={{ width: "35px" }}
              ></img>
              <span className="pl-2">Users</span>
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink className="nav-link" to="/preview-Link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="30"
                fill=""
                class="bi bi-link-45deg"
                viewBox="0 0 16 16"
              >
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
              </svg>
              <span className="pl-2">Preview Links</span>
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
              breakpoint="lg"
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
  } else if (userAuth.obj.role === "Nurse") {
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
              breakpoint="lg"
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
            breakpoint="lg"
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
          {/* Sidebar - Brand */}
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
                {/* My Fertility */}
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

          {/* Sidebar Toggler (Sidebar) */}
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
