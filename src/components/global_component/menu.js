import React, { useEffect, useState }  from "react";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown, Menu, Avatar } from "antd";
import {
  UserOutlined,
  DownOutlined,
  KeyOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { getUserProfile } from "../redux/AuthController";

const UserDropdown = ({ userAuth, setShowModal }) => {
  const profileUser = useSelector((state) => state.profile.userData);
  const [displayUser, setDisplayUser] = useState(profileUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const response = await dispatch(getUserProfile());
      console.log({response});
      if (response.payload) {
        setDisplayUser(response.payload.picture);
      }
    };
    
    fetchUserProfile();
  }, [dispatch]);

  const handleLogout = async () => {
  
    setShowModal(true);
  };

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
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
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
          src={displayUser}
          alt={userAuth?.obj?.firstName || "User"}
          icon={<UserOutlined />}
          size={42}
          style={{ marginRight: 8 }}
        />
        {isMobile?"":
        <span style={{ marginRight: 8, color: "#595959", fontSize: "14px" }}>
          {displayUser?.firstName || userAuth?.obj?.firstName || "User"} {displayUser?.lastName || userAuth?.obj?.lastName || ""}
        </span>}
        <DownOutlined style={{ color: "#595959", fontSize: "12px" }} />
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
