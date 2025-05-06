import React, { useState } from "react";
import { Layout, Tabs, Typography, Card } from "antd";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout style={{ padding: "20px", background: "#f8f9fc" }}>
      {/* Header Section */}
      {/* <Card style={{ marginBottom: "20px", borderRadius: "8px", boxShadow: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: "16px", fontWeight: "bold", color: "#3BA9F4" }}>{userEmail}</Text>
        </div>
      </Card> */}

      {/* Tabs Section */}
      <Card style={{ borderRadius: "8px", boxShadow: "0 0.15rem 1.75rem 0 rgba(58, 59, 69, 0.15)" }}>
        <Title level={4} style={{ marginBottom: "20px", color: "#4e73df" }}>
          SETTINGS
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarStyle={{
            fontWeight: "bold",
            borderBottom: "2px solid #eaecf4",
          }}
        >
          <TabPane tab="Manage Subscriptions" key="1">
            <Content style={{ padding: "20px 0" }}>
              <Title level={5} style={{ color: "#3BA9F4" }}>What is Lorem Ipsum?</Title>
              <Text style={{ color: "#858796" }}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="System Support" key="2">
            <Content style={{ padding: "20px 0" }}>
              <Text style={{ color: "#858796" }}>
                System support information will be displayed here. Add your content.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="Privacy Policy" key="3">
            <Content style={{ padding: "20px 0" }}>
              <Text style={{ color: "#858796" }}>Privacy policy content goes here. Add your details.</Text>
            </Content>
          </TabPane>
          <TabPane tab="Terms of Use" key="4">
            <Content style={{ padding: "20px 0" }}>
              <Text style={{ color: "#858796" }}>Terms of use information goes here. Add your content.</Text>
            </Content>
          </TabPane>
        </Tabs>
      </Card>
    </Layout>
  );
};

export default SettingsPage;
