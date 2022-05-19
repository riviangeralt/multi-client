import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import Controls from "../controls/Controls";
import { Row, Col, Grid, Typography, Radio, notification } from "antd";
import { useForm, FormProvider } from "react-hook-form";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { login, loginWithGoogle } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import firebase from "../../firebaseInit";

const { useBreakpoint } = Grid;
const Login = (props) => {
  //breakpoint
  //sm:576px md:768px  lg:992px  xl:1200px
  const [role, setRole] = useState("merchant");
  const methods = useForm();
  const screen = useBreakpoint();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      props.history.push("/dashboard");
    } else {
      props.history.push("/");
    }
  }, [isAuthenticated]);
  const onSubmit = (data) => {
    const newData = {
      ...data,
      type: role,
    };
    dispatch(login(newData)).then((res) => {
      notification[res.payload.status]({
        message: res.payload.status.toUpperCase(),
        description: res.payload.message,
      });
      if (res.payload.status === "success") {
        props.history.push("/dashboard");
      }
    });
  };

  const SignInWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(googleProvider)
      .then((res) => {
        const userData = {
          name:
            res.additionalUserInfo.profile.given_name +
            " " +
            res.additionalUserInfo.profile.family_name,
          email: res.additionalUserInfo.profile.email,
          type: role,
          provider: res.credential.providerId,
        };
        dispatch(loginWithGoogle(userData)).then((res) => {
          notification[res.payload.status]({
            message: res.payload.status.toUpperCase(),
            description: res.payload.message,
          });
          if (res.payload.status === "success") {
            props.history.push("/dashboard");
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Row
            gutter={[16, 16]}
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
            }}
          >
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Typography.Title level={4}>
                Smart Contracts for Smart People
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
              <Controls.TextField
                label="Password"
                name="password"
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
              <Radio.Group
                defaultValue={role}
                size="default"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <Radio.Button value="merchant">Merchant</Radio.Button>
                <Radio.Button value="user">User</Radio.Button>
              </Radio.Group>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.Button
                variant="primary"
                size="large"
                width="100%"
                type="submit"
              >
                Login
              </Controls.Button>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={24} xl={24}>
              <Controls.Button
                variant="outlined"
                size="large"
                width="100%"
                onClick={SignInWithGoogle}
              >
                {/* google logo link */}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                  alt="google logo"
                  style={{ width: 20, marginRight: 10 }}
                />
                Sign in with Google
              </Controls.Button>
            </Col>

            <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
              <Typography.Text type="secondary">
                Forgot Password?
                <Link to="/forgot-password">
                  <Typography.Text type="primary"> Click here</Typography.Text>
                </Link>
              </Typography.Text>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
              <Typography.Text type="secondary">
                Don't have an account?
                <Link to="/signup">
                  <Typography.Text type="primary"> Signup</Typography.Text>
                </Link>
              </Typography.Text>
            </Col>
            <Col className="gutter-row" xs={24} sm={24} md={24} lg={8} xl={8}>
              <Typography.Text type="secondary">
                Resend verification email?
                <Link to="/resend">
                  <Typography.Text type="primary"> Click here</Typography.Text>
                </Link>
              </Typography.Text>
            </Col>
          </Row>
        </form>
      </FormProvider>
    </div>
  );
};

export default withRouter(Login);
