import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Grid,
  Card,
  Avatar,
  Badge,
  Tag,
  Modal,
  Button,
} from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  InstagramOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import Controls from "../controls/Controls";
import { useForm, FormProvider } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashboard,
  addSocial,
  getSocials,
  getOrders,
} from "../../slices/dashboardSlice";
import { Link } from "react-router-dom";

const { Content } = Layout;
const { useBreakpoint } = Grid;
const Dashboard = () => {
  const screen = useBreakpoint();
  const methods = useForm();
  const [orders, setOrders] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [selectedSocial, setSelectedSocial] = useState("");
  const {
    socials: socialMedia,
    dashboardData,
    orders: ordersData,
  } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const icons = [
    {
      icon: <GithubOutlined />,
      link: null,
      slug: "github",
    },
    {
      icon: <TwitterOutlined />,
      link: null,
      slug: "twitter",
    },
    {
      icon: <LinkedinOutlined />,
      link: null,
      slug: "linkedin",
    },
    {
      icon: <FacebookOutlined />,
      link: null,
      slug: "facebook",
    },
    {
      icon: <InstagramOutlined />,
      link: null,
      slug: "instagram",
    },
  ];
  const socials = [
    {
      prefix: "https://github.com/",
      slug: "github",
    },
    {
      prefix: "https://twitter.com/",
      slug: "twitter",
    },
    {
      prefix: "https://linkedin.com/in/",
      slug: "linkedin",
    },
    {
      prefix: "https://facebook.com/",
      slug: "facebook",
    },
    {
      prefix: "https://instagram.com/",
      slug: "instagram",
    },
  ];
  useEffect(() => {
    //suggest a name for my application
    document.title = "Dashboard | Asayyex";
    dispatch(getSocials());
    dispatch(getOrders());
    dispatch(getDashboard()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);
  const onShowModal = () => {
    setModal(true);
  };

  const onSubmit = async (data) => {
    const social = socials.find((social) => social.slug === selectedSocial);
    //prepare data
    const socialData = {
      socialName: data[`${selectedSocial}_name`],
      socialLink: social.prefix,
      slug: selectedSocial,
    };
    dispatch(addSocial(socialData));
    setModal(false);
  };
  return (
    <>
      <Content
        style={{
          marginTop: screen["lg"] ? "16px" : "48px",
          padding: "0 16px",
          marginLeft: screen["lg"] ? "200px" : "0",
        }}
      >
        {modal && (
          <Modal
            visible={modal}
            centered
            title={`Add ${selectedSocial}`}
            onCancel={() => {
              setModal(false);
            }}
            footer={null}
          >
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Row gutter={[16, 16]}>
                  <Col className="gutter-row" xs={24} sm={24} md={24} lg={24}>
                    <Controls.TextField
                      label="Social Name"
                      name={`${selectedSocial}_name`}
                      rules={{ required: `${selectedSocial} name is required` }}
                      control={methods.control}
                      error={methods.formState.errors}
                      register={methods.register}
                      size="large"
                      addonBefore={
                        socials.find((social) => social.slug === selectedSocial)
                          ?.prefix
                      }
                    />
                  </Col>
                  <Col
                    className="gutter-row"
                    xs={24}
                    sm={24}
                    md={24}
                    lg={24}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: 16,
                    }}
                  >
                    <Controls.Button
                      variant="primary"
                      size="large"
                      style={{ marginTop: "16px" }}
                      text="Cancel"
                      onClick={() => {
                        setModal(false);
                      }}
                    />
                    <Controls.Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                      style={{ marginTop: "16px" }}
                      text="Add Social"
                    />
                  </Col>
                </Row>
              </form>
            </FormProvider>
          </Modal>
        )}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={24} lg={18} xl={18}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Card
                      style={{
                        width: "100%",
                        backgroundColor: "#fff",
                      }}
                    >
                      <Row
                        gutter={[16, 16]}
                        align="middle"
                        style={{ marginBottom: 16 }}
                      >
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                          <Avatar
                            style={{
                              backgroundColor: "#87d068",
                              verticalAlign: "middle",
                            }}
                            size="large"
                          >
                            Aasim
                          </Avatar>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                          <Typography.Title level={4} style={{ margin: 0 }}>
                            {user?.name}
                          </Typography.Title>
                        </Col>
                        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                          <Tag color="#87d068">Active</Tag>
                        </Col>
                      </Row>
                      <Typography.Text
                        type="secondary"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        Earned in March
                        <Typography.Text type="primary">
                          ₹ {dashboardData?.totalEarnings}
                        </Typography.Text>
                      </Typography.Text>
                      <Typography.Text
                        type="secondary"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 16,
                        }}
                      >
                        Total Projects
                        <Typography.Text type="primary">
                          {dashboardData?.totalServices}
                        </Typography.Text>
                      </Typography.Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    {/* Links to social networks */}
                    <Card>
                      <Typography.Title level={4}>
                        Links to social networks
                      </Typography.Title>
                      {icons.map((icon) => (
                        <Badge
                          count={
                            socialMedia?.find(
                              (social) => social.slug === icon.slug
                            ) ? null : (
                              <PlusOutlined
                                style={{
                                  background: "#000",
                                  borderRadius: "50%",
                                  color: "#FFF",
                                  padding: "2px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setSelectedSocial(icon.slug);
                                  onShowModal();
                                }}
                              />
                            )
                          }
                          offset={[-10, 5]}
                        >
                          <Avatar
                            size={screen["lg"] ? "large" : "default"}
                            icon={icon.icon}
                            style={{
                              cursor: "pointer",
                              margin: "5px",
                              backgroundColor: socialMedia?.find(
                                (social) => social.slug === icon.slug
                              )
                                ? icon.slug === "instagram"
                                  ? "#e4405f"
                                  : icon.slug === "facebook"
                                  ? "#3b5998"
                                  : icon.slug === "twitter"
                                  ? "#1da1f2"
                                  : icon.slug === "linkedin"
                                  ? "#0077b5"
                                  : icon.slug === "github"
                                  ? "#24292e"
                                  : "#ddd"
                                : "#ddd",
                            }}
                            onClick={() => {
                              let url = "";
                              let data = socialMedia?.find(
                                (social) => social.slug === icon.slug
                              );
                              if (data) {
                                url = data.link + data.name;
                              }
                              window.open(url, "_blank");
                            }}
                          />
                        </Badge>
                      ))}
                    </Card>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Card>
                      <Typography.Title level={4}>
                        {orders === "pending"
                          ? `Pending Orders (${dashboardData?.pendingOrders})`
                          : orders === "accepted"
                          ? `Accepted Orders (${dashboardData?.acceptedOrders})`
                          : `Rejected Orders (${dashboardData?.rejectedOrders})`}

                        <Typography.Text
                          strong
                          style={{ fontSize: 14, float: "right" }}
                        >
                          <Link to="/orders">View All</Link>
                        </Typography.Text>
                      </Typography.Title>
                      <Controls.CustomSelect
                        name="orders"
                        control={methods.control}
                        error={methods.formState.errors}
                        options={[
                          {
                            label: `Pending `,
                            value: "pending",
                          },
                          {
                            label: "Accepted",
                            value: "accepted",
                          },
                          {
                            label: "Rejected",
                            value: "rejected",
                          },
                        ]}
                        defaultValue={orders}
                        onChange={(e) => {
                          setOrders(e);
                        }}
                      />
                      <div>
                        {ordersData
                          .filter((order) => order.status === orders)
                          .map((order, index) => {
                            return (
                              <Row
                                key={index}
                                gutter={[16, 16]}
                                style={{ marginTop: 16 }}
                              >
                                <Col>
                                  <Typography.Text type="primary" strong>
                                    {order.user.email}
                                  </Typography.Text>
                                </Col>
                                <Col>
                                  <Tag>₹{order.amount / 100}</Tag>
                                </Col>
                                <Col>
                                  <Typography.Text type="primary" strong>
                                    {order.services.map((item) => item.name)}
                                  </Typography.Text>
                                </Col>
                              </Row>
                            );
                          })}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                <Card style={{ height: "100%" }}>
                  <Typography.Title level={3}>
                    Welcome {user?.name}
                  </Typography.Title>
                  <Typography.Text>
                    This is your dashboard. You can see your profile, manage
                    your orders, and more.
                  </Typography.Text>
                </Card>
              </Col>
            </Row>
          </>
        )}
      </Content>
    </>
  );
};

export default Dashboard;
