import React, { useState } from "react";
import { Row, Col } from "antd";
import SubscriptionBanner from "../../../../assets/images/bg/subscription_home-logo.svg";

import "../../../../screens/Subscription/subscription.css"
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

const Services = () => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
   
      <Row gutter={16} >
        <Col xs={20} sm={16}>
          <p style={{ color: "#335CAD", fontWeight: 600, fontSize: 20, marginBottom: 12 }}>SUBSCRIPTION PLANS</p>
          <p>
          Schedule an appointment with our care providers to receive personalized support, thoughtfully tailored to your unique needs, preferences, and goals.
          {/* <br>Our team is here to guide you every step of the way.</br> */}
          </p>
          <span>Our team is here to guide you every step of the way.</span>
          
          <div style={{ background: "#335CAD", display: "none" }}>
            <div style={{ padding: "3% 5%" }}>
              <p>Don't forget to purchase Mira!</p>
              <p>
                Before choosing a plan, users are advised to acquire Mira, as it's
                essential for screening and treating hormonal imbalances and
                conditions affecting fertility.
              </p>
              <p>
                Mira devices and test strips are sold separately and can be
                purchased through the Mira website.
              </p>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <img src={SubscriptionBanner} alt="subscription" className="subscription-image" />
        </Col>
      </Row>
      {showInfo && (
        <div
          style={{
            background: "#D6F3DE",
            borderRadius: 10,
            padding: "24px 32px 16px 32px",
            marginBottom: 24,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 16,
              right: 24,
              fontSize: 24,
              color: "#222",
              cursor: "pointer",
              lineHeight: 1,
            }}
            onClick={() => setShowInfo(false)}
            aria-label="Close"
          >
            &times;
          </span>
          <div>
            <span style={{ fontWeight: 700, color: "#339933" }}>
              Why Mira Tracking Helps
            </span>
            <div style={{ marginTop: 16, color: "#222" }}>
              <p style={{ marginBottom: 12 }}>
                Before your Initial Assessments, Mira tracking helps your care team understand your cycle patterns, screen for potential hormonal imbalances, and identify your fertility window.
              </p>
              <p style={{ marginBottom: 0 }}>
                It also ensures your bloodwork is timed accurately to the right cycle days.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Book Your Appointment Section */}
      <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap' }}>
        {/* Left Side */}
        <div
                          style={{
                            background: '#fff',
                            borderRadius: 10,
                            border: '1px solid #C2E6F8',
                            marginBottom: 24,
                            overflow: 'hidden',
                            flex: 1,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          }}
                        >
                          {/* Dark Blue Header */}
                          <div
                            style={{
                              background: '#335CAD',
                              padding: '16px 20px',
                              borderRadius: '10px 10px 0 0',
                            }}
                          >
                            <h3
                              style={{
                                margin: 0,
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',
                              }}
                            >
                              HOW TO BOOK AN APPOINTMENT
                            </h3>
                          </div>
                          
                          {/* White Content Area */}
                          <div
                            style={{
                              padding: '20px',
                              borderRadius: '0 0 10px 10px',
                            }}
                          >
                            <p style={{ 
                              marginBottom: '16px', 
                              color: '#222',
                              fontSize: '14px'
                            }}>
                              Schedule your appointment by contacting us:
                            </p>
                            
                            {/* Phone Contact */}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              marginBottom: '12px',
                              gap: '12px'
                            }}>
                              <PhoneOutlined style={{ 
                                color: '#335CAD', 
                                fontSize: '16px' 
                              }} />
                              <span style={{ color: '#222', fontSize: '14px' }}>
                                (403) 760-7017
                              </span>
                            </div>
                            
                            {/* Email Contact */}
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: '12px'
                            }}>
                              <MailOutlined style={{ 
                                color: '#335CAD', 
                                fontSize: '16px' 
                              }} />
                              <a 
                                href="mailto:book@myfertilitylabs.com"
                                style={{ 
                                  color: '#335CAD', 
                                  fontSize: '14px',
                                  textDecoration: 'underline'
                                }}
                              >
                                book@myfertilitylabs.com
                              </a>
                            </div>
                          </div>
                        </div>
        {/* Right Side */}
        <div style={{
          flex: 1,
          minWidth: 320,
          border: '1px solid #D6E2F5',
          borderRadius: 12,
          padding: '24px 32px',
          background: '#fff',
          boxSizing: 'border-box',
        }}>
          <div style={{ color: '#335CAD', fontWeight: 600, fontSize: 20, marginBottom: 18, textAlign: 'center' }}>
            Care Providers
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ fontSize: 28, marginTop: 2 }}>🩺</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Clinician</div>
                <div style={{ color: '#555', fontSize: 15 }}>Doctor, Pharmacist, and Nurse Practitioner</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ fontSize: 28, marginTop: 2 }}>🧬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Fertility Coach</div>
                <div style={{ color: '#555', fontSize: 15 }}>Fertility Support Practitioner and Fertility Educator</div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <span style={{ fontSize: 28, marginTop: 2 }}>🥬</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Nutritionist</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
