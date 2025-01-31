import React from "react";
import { Row, Col, Card, Button } from "antd";
import DashImg from "../../assets/images/dashboard.svg";
import TestImg from "../../assets/images/test2.png";
import PeriodCycleTracker from "./Cycle/cycle";

const customTitleStyle = {
  borderBottom: 0,
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  background: "#fafafa",
  padding: "12px 16px",
  width: "100%", 
};

export default function DashboardPatient() {
  return (
    <Row gutter={16}>
      <Col span={12} style={{ padding: "5%" }}>
        <div style={{ padding: 20, color: "#000000" }}>
          <p>
            Fertility is not just a journey; it's a testament to the strength
            and resilience of the human spirit.
          </p>
          <p>Keep it up and improve your health!</p>
        </div>
        <div bordered={false} style={{ borderRadius: 12 }}>
          <div
            style={{
              width: "100%",
              backgroundColor: "#335CAD",
              borderRadius: 12,
              height: "61px",
              display: "flex",
              alignItems: "left",
              justifyContent: "left",
            }}
          >
            <h3
              style={{
                margin: 0,
                color: "#fff",
                fontSize: "14px",
                padding: 20,
                marginBottom: 20,
              }}
            >
              Appointments
            </h3>
          </div>

          <div
            style={{
              padding: "16px 24px",
              borderRadius: 12,
              marginTop: "-15px",
              borderWidth: "1px",
              backgroundColor: "#fff",
              borderColor: "#C2E6F8",
              borderStyle: "solid",
            }}
          >
            <p>
              To schedule your appointment with your coach and clinician, click
              on the ‘Book Appointment’ link below.
            </p>
            <p>
              You’ll be redirected to the Jane App, where you can efficiently
              schedule and manage your appointment!
            </p>
            <Button type="primary"> Book Appointment</Button>
          </div>
        </div>

        {/* <div bordered={false} style={{ borderRadius: 12 }}>
          <div style={{ width: '100%', backgroundColor: '#335CAD', borderRadius: 12, height: '61px' }}>
            <h3 style={{ margin: 0, width: '100%', color: '#fff' }}>Appointments</h3>
          </div>
          <div style={{ padding: '16px 24px', borderRadius: 12, marginTop: '-15px', borderWidth: '1px', backgroundColor: '#fff', borderColor: '#C2E6F8', borderStyle: 'solid' }}>
            <p>To schedule your appointment with your coach and clinician, click on the ‘Book Appointment’ link below.</p>
            <p>You’ll be redirected to the Jane App, where you can efficiently schedule and manage your appointment!</p>
            <Button type='primary'>Book Appointment</Button>

          </div>
        </div> */}
      </Col>
      <Col span={12}>
        <div>
          <img src={DashImg}></img>
        </div>
        <img src={TestImg} style={{ width: "70%" }}></img>
        {/* <PeriodCycleTracker /> */}
      </Col>
    </Row>
  );
}
