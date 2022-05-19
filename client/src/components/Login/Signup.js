import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Row, Col, Typography, Grid, Tabs, notification } from "antd";
import Controls from "../controls/Controls";
import { useForm, FormProvider } from "react-hook-form";
import { UserOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { signupAll } from "../../slices/authSlice";

const { useBreakpoint } = Grid;
const { TabPane } = Tabs;

const CustomForm = (props) => {
  const methods = useForm();
  const { isMerchant } = props;
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    const newData = {
      name: isMerchant ? data["merchantName"] : data["customerName"],
      email: isMerchant ? data["merchantEmail"] : data["customerEmail"],
      password: isMerchant
        ? data["merchantPassword"]
        : data["customerPassword"],
      phone: isMerchant ? data["phone"] : null,
      type: isMerchant ? "merchant" : "user",
    };
    dispatch(
      signupAll({
        isMerchant,
        newData,
      })
    ).then((res) => {
      notification[res.payload.status]({
        message: res.payload.status.toUpperCase(),
        description: res.payload.message,
      });
    });
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Row gutter={[16, 16]}>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Controls.TextField
              label="Name"
              name={isMerchant ? "merchantName" : "customerName"}
              placeholder="Enter your name"
              rules={{
                required: "Name is required",
                pattern: {
                  value: /^[A-Za-z]{3,}$/i,
                  message: "Invalid name",
                },
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
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
            <Controls.TextField
              label="Email"
              name={isMerchant ? "merchantEmail" : "customerEmail"}
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
            <Controls.TextField
              label="Password"
              name={isMerchant ? "merchantPassword" : "customerPassword"}
              type="password"
              placeholder="Enter your password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 4,
                  message: "Password must be at least 4 characters long",
                },
              }}
              control={methods.control}
              error={methods.formState.errors}
              register={methods.register}
              size="large"
              prefix={<LockOutlined />}
            />
          </Col>
          {isMerchant && (
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.TextField
                label="Phone"
                name="phone"
                placeholder="Enter your phone"
                rules={{
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/i,
                    message: "Invalid phone number",
                  },
                  minLength: {
                    value: 10,
                    message: "Phone must be at least 10 characters long",
                  },
                }}
                control={methods.control}
                error={methods.formState.errors}
                register={methods.register}
                size="large"
                prefix={<PhoneOutlined />}
              />
            </Col>
          )}
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Controls.Button
              variant="primary"
              size="large"
              width="100%"
              type="submit"
            >
              Signup
            </Controls.Button>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
            <Typography.Text type="secondary">
              Already have an account?{" "}
              <Link to="/">
                <Typography.Text type="primary">Login</Typography.Text>
              </Link>
            </Typography.Text>
          </Col>
        </Row>
      </form>
    </FormProvider>
  );
};

const Signup = (props) => {
  const screen = useBreakpoint();
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
      <Tabs defaultActiveKey="1" style={{ width: "90%" }} centered>
        <TabPane tab="Merchant" key="1">
          <CustomForm isMerchant={true} />
        </TabPane>
        <TabPane tab="Customer" key="2">
          <CustomForm isMerchant={false} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withRouter(Signup);
