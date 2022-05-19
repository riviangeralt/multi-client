import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import { Row, Col, Typography, Grid, notification, Radio } from "antd";
import { useDispatch } from "react-redux";
import { useForm, FormProvider } from "react-hook-form";
import Controls from "../controls/Controls";
import {
  resendVerificationEmail,
  forgotPassword,
} from "../../slices/authSlice";
import { UserOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

const Resend = (props) => {
  console.log(props);
  const methods = useForm();
  const screen = useBreakpoint();
  const dispatch = useDispatch();
  const [role, setRole] = useState("merchant");

  const onSubmit = (data) => {
    const newData = {
      ...data,
      type: role,
    };
    if (props?.match?.path === "/forgot-password") {
      dispatch(forgotPassword(newData)).then((res) => {
        notification[res.payload.status]({
          message: res.payload.status.toUpperCase(),
          description: res.payload.message,
        });
      });
    } else {
      dispatch(resendVerificationEmail(newData)).then((res) => {
        notification[res.payload.status]({
          message: res.payload.status.toUpperCase(),
          description: res.payload.message,
        });
      });
    }
  };
  return (
    <div
      style={{
        width: screen["xs"]
          ? "90%"
          : screen["sm"]
          ? "50%"
          : screen["md"]
          ? "60%"
          : screen["lg"]
          ? "60%"
          : "40%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Typography.Title level={4}>
                Please enter your email address
              </Typography.Title>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.TextField
                label="Email"
                name="email"
                placeholder="Enter your email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                }}
                control={methods.control}
                error={methods.formState.errors}
                register={methods.register}
                size="large"
                prefix={<UserOutlined />}
              />
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Radio.Group
                defaultValue={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <Radio.Button value="merchant">Merchant</Radio.Button>
                <Radio.Button value="user">User</Radio.Button>
              </Radio.Group>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.Button type="submit" size="large" width="100%">
                Send
              </Controls.Button>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Typography.Text type="secondary">
                If your account is already verified, please{" "}
                <Link to="/">
                  <Typography.Text type="primary">Login</Typography.Text>
                </Link>
              </Typography.Text>
            </Col>
          </Row>
        </form>
      </FormProvider>
    </div>
  );
};

export default withRouter(Resend);
