import React, { useState } from "react";
import { Row, Col } from "antd";
import SubscriptionBanner from "../../../../assets/images/bg/subscription_home-logo.svg";

import "../../../../screens/Subscription/subscription.css"
import { CiShare1 } from "react-icons/ci";

const Services = () => {
  const [showInfo, setShowInfo] = useState(true);

  return (
    <>
   
      <Row gutter={16} >
        <Col xs={20} sm={16}>
          <p style={{ color: "#335CAD", fontWeight: 600, fontSize: 20, marginBottom: 12 }}>SUBSCRIPTION PLANS</p>
          <p style={{ padding: "5% 0", fontSize: 16 }}>
            Explore all our available plans for exclusive access to personalized
            support tailored to your preferences, needs and goals.
          </p>
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
        <div style={{ flex: 1, minWidth: 320 }}>
          <p style={{ color: '#335CAD', fontWeight: 600, marginBottom: 12 }}>Book Your Appointment</p>
          <p style={{ marginBottom: 18,color:"#000" }}>
            To book your appointments, please create a separate account for our booking system.
          </p>
       
          <button
            style={{
              background: '#3BA9F4',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '12px 36px',
              fontWeight: 600,
              boxShadow: '0 4px 10px #3ba9f422',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onClick={() => window.open('https://myfertilitylabs.simplybook.me/v2', '_blank')}
          >
            Book Now
            <CiShare1/>
          </button>
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
