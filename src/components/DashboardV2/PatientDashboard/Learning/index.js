import React, { useState } from "react";
import { Col, Collapse, Row } from "antd";
import "./learn.css";
import { useMediaQuery } from "react-responsive";
import learnImage from "../../../../assets/images/learn.png";

const { Panel } = Collapse;

const LearnInfo = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  return (
    <div className="cycle-tracking-container">
    <Row
  gutter={[16, 16]} // Adds spacing between columns
  style={{ alignItems: "center", background: "#EFD0BD80", padding: 20 }}
>
  {/* Video Column */}
  <Col xs={24} md={8}>
    <div className="video-frame">
      <iframe
        width="100%"
        height="315"
        src="https://www.youtube.com/embed/66TBPgXvXPE?si=8afiCNXy3dROuFtx"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  </Col>

  {/* Text Description Column */}
  <Col xs={24} md={8}>
    <div className="video-description">
      <h2>Cycle Tracking</h2>
      <p>
        Cycle tracking allows you to monitor your menstrual patterns, predict
        fertility windows, and gain valuable insights into your reproductive
        health.
      </p>
      <p>
        Watch the video from one of our expert Fertility Coaches to{" "}
        <span style={{ color: "#1890ff", cursor: "pointer" }}>learn more</span>
        !
      </p>
    </div>
  </Col>

  {!isMobile && (
        <Col xs={24} md={8}>
          <img
            src={learnImage}
            alt="Learn"
            style={{
              width: "80%", 
              height: "auto", 
              borderRadius: "10px",
              float: "right",
              position: "absolute",
              top: "-100px", 
            }}
          />
        </Col>
      )}
</Row>


      <div style={{ position: "relative", marginTop: "50px" }}>
        <Row
          style={{
            display: isMobile?"none":"flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Col
            xs={24}
            sm={12}
            md={8}
            style={{
              borderWidth: "1px",
              borderColor: "#C2E6F8",
              borderStyle: "solid",
              borderRadius: "10px",
              height: "300px",
              padding: "16px",
              textAlign: "center",
            }}
          >
          </Col>
        </Row>

        <Row
          gutter={[24, 0]}
          justify="space-between"
          align="top"
          style={{
            position: isMobile?"relative":"absolute", 
            top: isMobile?0:"50%",
            left: isMobile?0:"50%",
            transform: isMobile?0:"translate(-50%, -50%)", 
            width: "100%",
            zIndex: 2,
          }}
        >
          <Col
            xs={24}
            sm={12}
            md={11}
            style={{
              background: "#335CADCC",
              padding: "16px",
              color: "#fff",
            }}
          >
            <p style={{fontWeight:"bold"}}>Day 3 Bloodwork</p>
            <p>
              Day 3 bloodwork is done on the third day of your menstrual cycle,
              with Day 1 being the first day of full menstrual flow. Testing on
              this specific day provides the most accurate measurement of key
              fertility hormones, such as FSH and Estradiol, which are critical
              for assessing ovarian reserve.
            </p>
          </Col>

          <Col
            xs={24}
            sm={12}
            md={11}
            style={{
              background: "#111F4ACC",
              padding: "16px",
              color: "#fff",
              marginTop:isMobile?10:0
            }}
          >
            <p style={{fontWeight:"bold"}}>Peak +7 Bloodwork</p>
            <p>
              Peak+7 bloodwork is done seven days after your identified peak
              fertility day, typically when ovulation is expected to have
              occurred. This test measures progesterone levels, helping assess
              whether ovulation has taken place and if the body is producing
              enough progesterone to support a potential pregnancy. The timing
              is crucial, as it provides an accurate snapshot of the luteal
              phase, which is key to understanding fertility and cycle health
            </p>
          </Col>
          
        </Row>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3 style={{color:"#2F946C", fontWeight:"bold", textAlign:"center"}}>Here are some answers to questions you may have.</h3>
        <Collapse
          activeKey={isFaqOpen ? "1" : ""}
          onChange={() => setIsFaqOpen(!isFaqOpen)}
        >
          <Panel header="Is My Fertility Labs right for you?" key="1" style={{background:"#2F946C", color:"#fff"}}>
            <p>
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).
            </p>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default LearnInfo;
