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
import { useMediaQuery } from "react-responsive";

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
        <NavLink to="/settings">Settings</NavLink>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => setShowModal(true)}>
        <button
          style={{
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </Menu.Item>
    </Menu>
  );
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <div
        onClick={(e) => e.preventDefault()}
        style={{ display: "flex", alignItems: "center"}}
      >
        <Avatar
          src={userAuth.obj.profile ?? defaultIconImage}
          alt={userAuth.obj.firstName}
          icon={<UserOutlined />}
          size="small"
          style={{ marginRight: 8 }}
        />
        {isMobile?"":
        <span style={{ marginRight: 8, color: "#595959", fontSize: "14px" }}>
          {userAuth.obj.firstName} {userAuth.obj.lastName}
        </span>}
        <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
