import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import PatDash from "./PatientDashboard";
import MyNavbar from "../global_component/navbar";
import Footer from "../global_component/footer";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import {
  CalendarOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  MedicineBoxOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import "./dashboard.css";
import Assessment from "./PatientDashboard/Assessment/Assessment";

const { Content, Sider } = Layout;

function DashboardMain() {
  const [selectedMenuKey, setSelectedMenuKey] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedMenuKey(e.key);
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case "1":
        return <PatDash />;
      case "2":
        return <Assessment />;
      default:
        return <PatDash />;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#fff" }}>
      <Sider
        collapsible
        breakpoint="lg"
        collapsedWidth="0"
        theme="light"
        className="navbar-nav sidebar sidebar-light accordion"
      >
        <div className="logo" />
        <NavLink
          className="sidebar-brand d-flex align-items-center justify-content-center"
          to="/"
        >
          <div className="sidebar-brand-text mx-3">
            <NavLink className="text-white no-underline" to="/">
              <img src={fertilityImage} alt="logo" style={{ width: "100%" }} />
            </NavLink>
          </div>
        </NavLink>

        <Menu
          theme="light"
          defaultSelectedKeys={["1"]}
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          onClick={handleMenuClick}
        >
          <Menu.Item key="1" icon={<QrcodeOutlined />}>
            <span className="no-underline">HOME</span>
          </Menu.Item>
          <Menu.Item key="2" icon={<FileSearchOutlined />}>
            <span className="no-underline">ASSESS</span>
          </Menu.Item>
          <Menu.Item key="3" icon={<LineChartOutlined />}>
            <span className="no-underline">CHART</span>
          </Menu.Item>
          <Menu.Item key="4">
            <span className="no-underline">LABS</span>
          </Menu.Item>
          <Menu.Item key="5" icon={<MedicineBoxOutlined />}>
            <span className="no-underline">MEDS</span>
          </Menu.Item>
          <Menu.Item key="6" icon={<CalendarOutlined />}>
            <span className="no-underline">APPT</span>
          </Menu.Item>
          <Menu.Item key="7">
            <span className="no-underline">PLANS</span>
          </Menu.Item>
          <Menu.Item key="8">
            <span className="no-underline">LEARN</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ background: "#fff" }}>
        <MyNavbar />
        <Content style={{ margin: "0 16px", background: "#fff" }}>
          {renderContent()}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default DashboardMain;
