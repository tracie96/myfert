import React, { useState } from "react";
import { Col, Collapse, Row } from "antd";
import "./learn.css";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

import { Button, Typography, List } from "antd";
const { Title, Text } = Typography;

const { Panel } = Collapse;

const LearnInfo = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const videos = [
    {
      id: 'menstrual',
      title: 'Menstrual Cycle 101',
      duration: '19:17',
      completed: false,
      url: 'https://www.loom.com/embed/cf0959fd0b8d4344939a9feac194502e'
    },
    {
      id: 'fertile',
      title: 'Identifying the Fertile Window',
      duration: '10:45',
      completed: false,
      url: 'https://www.loom.com/embed/f683c921a51140498060e8302f9e61f3'
    },
    {
      id: 'bloodwork',
      title: 'Timing Menstrual Cycle Bloodwork',
      duration: '6:09',
      completed: false,
      url: 'https://www.loom.com/embed/2c595f7fc62e4c86beca9ee15bbd51ed'
    }
  ];

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleStartQuiz = (quizType) => {
    navigate('/menstrual-cycle-quiz', { state: { quizType } });
  };

  return (
    <div className="cycle-tracking-container">
      <Row gutter={[16, 16]} style={{ marginBottom: '40px' }}>
        <Col xs={24} sm={14}>
          <div style={{
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            {selectedVideo ? (
              <div style={{ width: '100%', position: 'relative', paddingBottom: '56.25%' }}>
                <iframe
                  src={selectedVideo.url}
                  title="Menstrual Cycle 101"
                  frameBorder="0"
                  allowFullScreen
                  webkitallowfullscreen
                  mozallowfullscreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </div>
            ) : (
              <>
                 <iframe
                  src='https://www.loom.com/embed/cf0959fd0b8d4344939a9feac194502e'
                  title="Menstrual Cycle 101"
                  frameBorder="0"
                  allowFullScreen
                  webkitallowfullscreen
                  mozallowfullscreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                />
              </>
            )}
         <p style={{ marginTop: '15px', color: '#666' }}>Timing Menstrual Cycle Bloodwork, Identifying the Fertile Window, and Using Ovulation Tests</p>

          </div>
        </Col>
        <Col xs={24} sm={10}>
          <div style={{
            background: '#FFFFFF',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <div>
              <Title level={4} style={{ marginBottom: '20px' }}>Cycle Tracking Videos</Title>
              <div style={{ color: '#666', float: 'right', marginTop: '-45px' }}>50:26</div>
              <List
                itemLayout="horizontal"
                dataSource={videos}
                renderItem={item => (
                  <List.Item 
                    style={{ 
                      padding: '12px 0', 
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      backgroundColor: selectedVideo?.id === item.id ? '#f5f5f5' : 'transparent'
                    }}
                    onClick={() => handleVideoSelect(item)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {item.completed ? (
                        <div style={{ color: '#52c41a', marginRight: '10px' }}>✓</div>
                      ) : (
                        <div style={{ color: '#1890ff', marginRight: '10px' }}>▶</div>
                      )}
                      <div style={{ flex: 1 }}>
                        <Text>{item.title}</Text>
                      </div>
                      <div style={{ color: '#666' }}>{item.duration}</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <div style={{ marginTop: '30px' }}>
              <Title level={4} style={{ marginBottom: '20px' }}>Optional Videos</Title>
              <div style={{ color: '#666', float: 'right', marginTop: '-45px' }}>9:59</div>
              <List
                itemLayout="horizontal"
                dataSource={[
                  { title: 'Using Ovulation Tests', duration: '9:59', completed: false }
                ]}
                renderItem={item => (
                  <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <div style={{ color: '#1890ff', marginRight: '10px' }}>▶</div>
                      <div style={{ flex: 1 }}>
                        <Text>{item.title}</Text>
                      </div>
                      <div style={{ color: '#666' }}>{item.duration}</div>
                    </div>
                  </List.Item>
                )}
              />
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#FFF2F0', borderRadius: '6px' }}>
              <Text type="danger">Please watch Cycle Tracking Videos prior to starting the quiz</Text>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Title level={2}>Menstrual Cycle 101</Title>
          
          <div style={{ marginTop: '20px' }}>
            <Title level={4}>Learning Objective</Title>
            <ul style={{ listStyle: 'disc', paddingLeft: '20px', color: '#666' }}>
              <li>Lifespan of an egg, how long after ovulation implantation occurs, when a pregnancy test would be accurate</li>
              <li>The roles of cervical mucus in reproduction</li>
              <li>Menstrual cycle phases</li>
              <li>Cycle charting biomarkers</li>
              <li>What are FSH, LH, Estrogen, Progesterone</li>
              <li>Where and when is progesterone produced?</li>
              <li>What hormone triggers ovulation?</li>
            </ul>
          </div>

          <div style={{ marginTop: '30px' }}>
            <div style={{ 
              background: '#F8F0F8', 
              padding: '20px', 
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Title level={3} style={{ color: '#8B3A8B', margin: 0 }}>Menstrual Cycle 101</Title>
                <Button 
                  type="primary" 
                  style={{ 
                    backgroundColor: '#9B6B9B',
                    borderColor: '#9B6B9B'
                  }}
                  onClick={() => handleStartQuiz('menstrual')}
                >
                  Start Quiz
                </Button>
              </div>
              <Collapse 
                ghost
                expandIconPosition="end"
              >
                <Panel header={<Text strong style={{ color: '#8B3A8B' }}>Summary and Key Terms</Text>} key="1">
                  <div style={{ padding: '10px 0' }}>
                    Content for summary and key terms goes here
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div style={{ 
              background: '#F0F8F0', 
              padding: '20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Title level={3} style={{ color: '#2F946C', margin: 0 }}>Fertile Window</Title>
                <Button 
                  type="primary" 
                  style={{ 
                    backgroundColor: '#00800080',
                    borderColor: '#00800080'
                  }}
                  onClick={() => handleStartQuiz('fertile')}
                >
                  Start Quiz
                </Button>
              </div>
              <Collapse 
                ghost
                expandIconPosition="end"
              >
                <Panel header={<Text strong style={{ color: '#2F946C' }}>Summary and Key Terms</Text>} key="1">
                  <div style={{ padding: '10px 0' }}>
                    Content for summary and key terms goes here
                  </div>
                </Panel>
              </Collapse>
            </div>

            <div style={{ 
              background: '#EE38381A', 
              padding: '20px',
              marginTop:'20px', 
              borderRadius: '10px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center'
              }}>
                <Title level={3} style={{ color: '#EE3838', margin: 0 }}>Timing Bloodwork</Title>
                <Button 
                  type="primary" 
                  style={{ 
                    backgroundColor: '#EE3838',
                    borderColor: '#EE3838'
                  }}
                  onClick={() => handleStartQuiz('timing')}
                >
                  Start Quiz
                </Button>
              </div>
              <Collapse 
                ghost
                expandIconPosition="end"
              >
                <Panel header={<Text strong style={{ color: '#EE3838' }}>Summary and Key Terms</Text>} key="1">
                  <div style={{ padding: '10px 0' }}>
                    <Text>
                      Note: If you are not getting these questions right, or any of it is confusing, 
                      please book an additional session with your Fertility Educator.
                    </Text>
                  </div>
                </Panel>
              </Collapse>
            </div>

          </div>
        </Col>
      </Row>

      <div style={{ position: "relative", marginTop: "50px" }}>
        <Row
          gutter={[16, 16]}
          justify="space-between"
          style={{
            position: "relative",
            width: "100%",
            zIndex: 2,
            minHeight: "100%"
          }}
        >
          <Col
            xs={24}
            sm={24}
            md={11}
            style={{
              display: "flex",
              marginBottom: isMobile ? "16px" : 0,
              height: "100%"
            }}
          >
            <div style={{
              background: "#335CADCC",
              padding: "20px",
              color: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>
                <p style={{ 
                  fontWeight: "bold", 
                  fontSize: "18px", 
                  marginBottom: "12px" 
                }}>Day 3 Bloodwork</p>
                <p style={{ 
                  fontSize: "14px", 
                  lineHeight: "1.6",
                  flex: "1 1 auto",
                  margin: 0
                }}>
                  Day 3 bloodwork is done on the third day of your menstrual cycle,
                  with Day 1 being the first day of full menstrual flow. Testing on
                  this specific day provides the most accurate measurement of key
                  fertility hormones, such as FSH and Estradiol, which are critical
                  for assessing ovarian reserve.
                </p>
              </div>
            </div>
          </Col>

          <Col
            xs={24}
            sm={24}
            md={11}
            style={{
              display: "flex",
              height: "100%"
            }}
          >
            <div style={{
              background: "#111F4ACC",
              padding: "20px",
              color: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "100%"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}>
                <p style={{ 
                  fontWeight: "bold", 
                  fontSize: "18px", 
                  marginBottom: "12px" 
                }}>Peak +7 Bloodwork</p>
                <p style={{ 
                  fontSize: "14px", 
                  lineHeight: "1.6",
                  flex: "1 1 auto",
                  margin: 0
                }}>
                  Peak+7 bloodwork is done seven days after your identified peak
                  fertility day, typically when ovulation is expected to have
                  occurred. This test measures progesterone levels, helping assess
                  whether ovulation has taken place and if the body is producing
                  enough progesterone to support a potential pregnancy. The timing
                  is crucial, as it provides an accurate snapshot of the luteal
                  phase, which is key to understanding fertility and cycle health
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h3 style={{ color: "#2F946C", fontWeight: "bold", textAlign: "center" }}>Here are some answers to questions you may have.</h3>
        <Collapse
          activeKey={isFaqOpen ? "1" : ""}
          onChange={() => setIsFaqOpen(!isFaqOpen)}
        >
          <Panel header="Is My Fertility Labs right for you?" key="1" style={{ background: "#2F946C", color: "#fff" }}>
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
