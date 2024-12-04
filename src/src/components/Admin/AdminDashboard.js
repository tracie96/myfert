import { Layout, Menu } from "antd";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MyNavbar from "../global_component/navbar";
import Footer from "../global_component/footer";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import {
  LineChartOutlined,
} from "@ant-design/icons";
import "../DashboardV2/dashboard.css";
import UserManagement from "./UserManagement";

const { Content, Sider } = Layout;

function AdminDashboard() {
  const [selectedMenuKey, setSelectedMenuKey] = useState("1");

  const handleMenuClick = (e) => {
    setSelectedMenuKey(e.key);
  };

  const renderContent = () => {
    switch (selectedMenuKey) {
      case "1":
        return <UserManagement />;
      default:
        return <UserManagement />;
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
          <Menu.Item key="1">
            <span className="no-underline">USER MANAGEMENT</span>
          </Menu.Item>
          <Menu.Item key="2">
            <span className="no-underline">TICKETS</span>
          </Menu.Item>
          <Menu.Item key="3" icon={<LineChartOutlined />}>
            <span className="no-underline">STATISTICS</span>
          </Menu.Item>
          <Menu.Item key="4">
            <span className="no-underline">LOGS</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ background: "#fff" }}>
        {/* <MyNavbar /> */}
        <Content style={{ margin: "0 32px", background: "#fff" }}>
          {renderContent()}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;