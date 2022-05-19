import React from "react";
import { Layout, Typography, Grid, Dropdown, Menu } from "antd";
import Icon from "@ant-design/icons";
import {
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { logout } from "../../slices/authSlice";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const CustomHeader = (props) => {
  const screen = useBreakpoint();
  const dispatch = useDispatch();

  const menu = (
    <Menu>
      <Menu.Item>Profile</Menu.Item>
      <Menu.Item
        danger
        onClick={() => dispatch(logout()).then(() => props.history.push("/"))}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header
      className="site-layout-sub-header-background"
      style={{
        padding: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography.Title
        style={{ color: "#fff", padding: 16, margin: 0 }}
        level={3}
      >
        {/* hode the image if the screen is large */}
        {!screen["lg"] && (
          <img
            src="https://payroll.razorpay.com/assets/payroll-logo.svg"
            alt=""
            style={{ height: 32, width: "90%" }}
          />
        )}
      </Typography.Title>
      {/* icons for navigation */}
      <Typography.Text
        style={{ color: "#fff", padding: 16, display: "flex", columnGap: 16 }}
      >
        <Dropdown overlay={menu}>
          <UserOutlined style={{ width: 20, height: 20, color: "#fff" }} />
        </Dropdown>
        <VideoCameraOutlined style={{ width: 20, height: 20, color: "#FFF" }} />
        <UploadOutlined style={{ width: 20, height: 20, color: "#FFF" }} />
      </Typography.Text>
    </Header>
  );
};

export default withRouter(CustomHeader);
