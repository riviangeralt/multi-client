import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  CloudServerOutlined,
  OrderedListOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="https://payroll.razorpay.com/assets/payroll-logo.svg"
          alt=""
          style={{ height: 32, width: "90%" }}
        />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<DashboardOutlined />}>
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CloudServerOutlined />}>
          <Link to="/services">Services</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<OrderedListOutlined />}>
          <Link to="/orders">Orders</Link>
        </Menu.Item>
        <Menu.Item key="4" icon={<DollarCircleOutlined />}>
          <Link to="/earnings">Earnings</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
