import React from "react";
import { NavLink } from "react-router-dom";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import testIcon from "../../assets/images/sidebar/taskSearch.png";
import assessIcon from "../../assets/images/sidebar/analytics.png";
import medsIcon from "../../assets/images/sidebar/care.png";
import apptIcon from "../../assets/images/sidebar/calender.png";
import learnIcon from "../../assets/images/sidebar/instruction.png";
import { useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  ExperimentOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  BookOutlined,
  BankOutlined,
} from "@ant-design/icons";

function PatientDashboard() {
  const { userAuth } = useSelector((state) => state.authentication);

  return (
    <>
      <Menu theme="light" mode="inline">
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <NavLink to="/home/dashboard">Dashboard</NavLink>
        </Menu.Item>
        <Menu.Item
          key="2"
          icon={<img src={testIcon} alt="test" style={{ width: "20px" }} />}
        >
          <NavLink to="/tests">TESTS</NavLink>
        </Menu.Item>
        <Menu.Item
          key="3"
          icon={<img src={assessIcon} alt="assess" style={{ width: "20px" }} />}
        >
          <NavLink to="/assessment">ASSESS</NavLink>
        </Menu.Item>
        <Menu.Item
          key="4"
          icon={<img src={medsIcon} alt="meds" style={{ width: "20px" }} />}
        >
          <NavLink to="/medication">MEDS</NavLink>
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<img src={apptIcon} alt="appt" style={{ width: "20px" }} />}
        >
          <NavLink to="/appointment">APPT</NavLink>
        </Menu.Item>
        <Menu.Item
          key="6"
          icon={<img src={learnIcon} alt="learn" style={{ width: "20px" }} />}
        >
          <NavLink to="/learn">LEARN</NavLink>
        </Menu.Item>
        {userAuth && userAuth.obj && !userAuth.obj.companyName ? (
          <Menu.SubMenu
            key="sub1"
            icon={<BankOutlined />}
            title="Manage Company"
          >
            <Menu.Item key="7">
              <NavLink to="add-company">Add Company</NavLink>
            </Menu.Item>
            <Menu.Item key="8">
              <NavLink to="company-list">Company List</NavLink>
            </Menu.Item>
          </Menu.SubMenu>
        ) : (
          ""
        )}
      </Menu>
    </>
  );
}

export default PatientDashboard;
