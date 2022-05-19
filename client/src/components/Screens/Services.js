import React, { useEffect } from "react";
import { Layout, Grid, Card, Tag, Row, Col } from "antd";
import Controls from "../controls/Controls";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchServices } from "../../slices/serviceSlice";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const Services = () => {
  const screen = useBreakpoint();
  const methods = useForm();
  const dispatch = useDispatch();
  const { services, isLoading } = useSelector((state) => state.service);

  useEffect(() => {
    document.title = "Services | Asayyex";
    dispatch(fetchServices());
  }, []);
  console.log(services);
  return (
    <>
      <Content
        style={{
          marginTop: screen["lg"] ? "16px" : "48px",
          padding: "0 16px",
          marginLeft: screen["lg"] ? "200px" : "0",
        }}
      >
        <Controls.TextField
          label="Search Projects"
          name="search"
          control={methods.control}
          error={methods.formState.errors}
          placeholder="Search Projects"
          size="large"
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
            {services.map((service) => {
              return (
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Card
                    key={service._id}
                    title={service.name}
                    extra={<Tag color="blue">₹ {service.price}</Tag>}
                    actions={[
                      <Controls.Button
                        text="View"
                        variant="primary"
                        color="primary"
                        size="small"
                        onClick={() => {}}
                      />,
                      <Controls.Button
                        text="Update"
                        variant="primary"
                        color="primary"
                        size="small"
                        onClick={() => {
                          console.log(service);
                        }}
                      />,
                    ]}
                  >
                    {service.description}
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </Content>
    </>
  );
};

export default Services;
