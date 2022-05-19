import React, { useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { verifyAll } from "../../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Col, notification, Row, Typography } from "antd";

const Verification = (props) => {
  const token = props?.match?.params?.token;
  const id = props?.match?.params?.id;
  const isMerchant = props?.match?.path?.includes("merchant");
  const dispatch = useDispatch();
  const { isVerified } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(verifyAll({ id, token, isMerchant })).then((res) => {
      notification[res.payload.status]({
        message: res.payload.status.toUpperCase(),
        description: res.payload.message,
      });
    });
  }, [dispatch, id, token, isVerified]);

  return isVerified ? (
    <div
      style={{
        width: "90%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <Row justify="center" align="middle">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Title level={2}>
            Your account has been verified.
          </Typography.Title>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Text type="secondary">
            You can now login to your account.
            <Link to="/">
              <Typography.Text type="primary">Login</Typography.Text>
            </Link>
          </Typography.Text>
        </Col>
      </Row>
    </div>
  ) : (
    <div
      style={{
        width: "90%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
    >
      <Row justify="center" align="middle">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Title level={2}>
            There was an error verifying your account or it seems your link has
            expired.
          </Typography.Title>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Typography.Text type="secondary">
            Please try again.{" "}
            <Link to="/resend">
              <Typography.Text type="primary">
                Resend verification email
              </Typography.Text>
            </Link>
          </Typography.Text>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(Verification);
