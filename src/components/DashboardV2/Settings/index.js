import React, { useState } from "react";
import { Layout, Tabs, Typography, Divider } from "antd";

const { Content } = Layout;
const { TabPane } = Tabs;
const { Text, Title } = Typography;

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <Layout style={{ padding: "20px", background: "#fff" }}>
      {/* Header Section */}
      <div style={{ marginBottom: "20px" }}>
        <Text style={{ fontSize: "16px", fontWeight: "bold" }}>example@gmail.com</Text>
        <Divider />
      </div>

      {/* Tabs Section */}
      <div>
        <Title level={4} style={{ marginBottom: "20px", color: "#00ADEF" }}>
          SETTINGS
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          tabBarStyle={{
            fontWeight: "bold",
          }}
        >
          <TabPane tab="Manage Subscriptions" key="1">
            <Content>
              <Title level={5}>What is Lorem Ipsum?</Title>
              <Text>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy text
                ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="System Support" key="2">
            <Content>
              <Text>
                System support information will be displayed here. Add your content.
              </Text>
            </Content>
          </TabPane>
          <TabPane tab="Privacy Policy" key="3">
            <Content>
              <Text>Privacy policy content goes here. Add your details.</Text>
            </Content>
          </TabPane>
          <TabPane tab="Terms of Use" key="4">
            <Content>
              <Text>Terms of use information goes here. Add your content.</Text>
            </Content>
          </TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
