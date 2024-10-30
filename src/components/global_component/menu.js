import React from "react";
import { Avatar, Dropdown, Menu } from "antd";
import {
  UserOutlined,
  DownOutlined,
  KeyOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";

const defaultIconImage = "img/undraw_profile.svg";

const UserDropdown = ({ userAuth, setShowModal }) => {
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        <NavLink to="/profile">Profile</NavLink>
      </Menu.Item>
      <Menu.Item key="update-password" icon={<KeyOutlined />}>
        <NavLink to="/update-password">Update Password</NavLink>
      </Menu.Item>
      <Menu.Item key="settings" icon={<SettingOutlined />}>
        <NavLink to="/setting">Settings</NavLink>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        <button
          style={{
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
          }}
          onClick={() => setShowModal(true)}
        >
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <div
        onClick={(e) => e.preventDefault()}
        style={{ display: "flex", alignItems: "center", width: "100px" }}
      >
        <Avatar
          src={userAuth.obj.profile ?? defaultIconImage}
          alt={userAuth.obj.firstName}
          icon={<UserOutlined />}
          size="small"
          style={{ marginRight: 8 }}
        />
        <span style={{ marginRight: 8, color: "#595959", fontSize: "14px" }}>
          {userAuth.obj.firstName} {userAuth.obj.lastName}
        </span>
        <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
