import React from "react";
import { withRouter } from "react-router-dom";
import { Row, Col, Typography, Grid, notification } from "antd";
import Controls from "../controls/Controls";
import { useForm, FormProvider } from "react-hook-form";
import { LockOutlined } from "@ant-design/icons";
import { changePassword } from "../../slices/authSlice";
import { useDispatch } from "react-redux";

const { useBreakpoint } = Grid;

const ChangePassword = (props) => {
  const screen = useBreakpoint();
  const methods = useForm();
  const dispatch = useDispatch();
  const token = props.match.params.token;
  const id = props.match.params.id;
  const type = props.match.path.includes("merchant") ? "merchant" : "user";

  const onSubmit = (data) => {
    const newData = {
      password: data.password,
      token,
      id,
      type,
    };
    dispatch(changePassword(newData)).then((res) => {
      notification[res.payload.status]({
        message: res.payload.status.toUpperCase(),
        description: res.payload.message,
      });
    });
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
        margin: "0 auto",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Row gutter={[16, 16]}>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Typography.Title level={4}>Change Password</Typography.Title>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.TextField
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                }}
                control={methods.control}
                error={methods.formState.errors}
                register={methods.register}
                size="large"
                prefix={<LockOutlined />}
              />
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                rules={{
                  required: "Confirm Password is required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
                  },
                  //check if password and confirm password match
                  validate: (value) =>
                    value === methods.watch("password") ||
                    "Passwords do not match",
                }}
                control={methods.control}
                error={methods.formState.errors}
                register={methods.register}
                size="large"
                prefix={<LockOutlined />}
              />
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.Button type="submit" size="large" width="100%">
                Change Password
              </Controls.Button>
            </Col>
          </Row>
        </form>
      </FormProvider>
    </div>
  );
};

export default withRouter(ChangePassword);
