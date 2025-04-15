import React, { useState } from "react";
import { Col, Collapse, Row, Radio, Space } from "antd";
import "./learn.css";
import { useMediaQuery } from "react-responsive";
import learnImage from "../../../../assets/images/learnn-image.svg";
import { useNavigate } from "react-router-dom";

import { Button, Typography, List, Modal } from "antd";
const { Title, Text, Paragraph } = Typography;

const { Panel } = Collapse;

const menstrualCycleQuizData = [
  {
    question: "How long does an egg live after ovulation (if it is not fertilized)?",
    options: [
      "12-24 hrs",
      "48 hrs",
      "7 days",
      "Until you get your period"
    ],
    answer: 0,
    explanation: "An unfertilized egg will live for 12-24 hours after ovulation, and can only be fertilized during this time."
  },
  {
    question: "When would a pregnancy test be accurate?",
    options: [
      "8-14 days after ovulation",
      "6-12 days after intercourse",
      "14 days after your period ends",
      "Day 28 of your cycle"
    ],
    answer: 0,
    explanation: "It takes a fertilized egg 6-12 days to travel to the uterus and implant, and another 2 days or so for the pregnancy hormone hCG to rise enough to be detected on a pregnancy test."
  },
  {
    question: "What role does cervical mucus play in reproduction?",
    options: [
      "It keeps sperm alive for multiple days to await ovulation",
      "It filters out low quality sperm",
      "It provides a lattice-like structure for sperm to travel from the vagina to the uterus",
      "All of the above"
    ],
    answer: 3,
    explanation: "Cervical mucus is vital to reproduction, and allowing sperm to meet the egg."
  },
  {
    question: "What are the hormonal phases of the menstrual cycle?",
    options: [
      "Follicular Phase and Menstruation",
      "Follicular Phase and Luteal Phase",
      "Luteal Phase and Ovulation",
      "Proliferative Phase and Follicular Phase"
    ],
    answer: 1,
    explanation: null
  },
  {
    question: "What are the hormones that play the most important roles in the menstrual cycle?",
    options: [
      "Cortisol, Estrogen, Luteinizing Hormone, and Progesterone",
      "Follicle Stimulation Hormone, Thyroid Stimulating Hormone, Estrogen, and Progesterone",
      "Follicle Stimulation Hormone, Estrogen, Luteinizing Hormone, and Progesterone",
      "Anti-Mullerian Hormone, Follicle Stimulation Hormone, Estrogen, and Luteinizing Hormone"
    ],
    answer: 2,
    explanation: null
  },
  {
    question: "What hormone directly triggers ovulation?",
    options: [
      "Follicle Stimulation Hormone",
      "Estrogen",
      "Progesterone",
      "Luteinizing Hormone"
    ],
    answer: 3,
    explanation: "Luteinizing Hormone luteinizes the dominant follicle, and in the process the egg inside that follicle is released."
  },
  {
    question: "Which of these is a cycle charting biomarker?",
    options: [
      "Cervical mucus",
      "Basal body temperature",
      "At home urinary hormone tests",
      "All of the above"
    ],
    answer: 3,
    explanation: null
  },
  {
    question: "When in the menstrual cycle is progesterone produced?",
    options: [
      "During your period",
      "Leading up to ovulation",
      "In the Follicular Phase",
      "In the Luteal Phase"
    ],
    answer: 3,
    explanation: "Progesterone is only produced during and after ovulation, in the Luteal Phase."
  }
];

const QuizModal = ({ visible, onClose, quizData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (e) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(selectedAnswers).forEach(question => {
      if (selectedAnswers[question] === quizData[question].answer) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      title={<Title level={4}>Menstrual Cycle 101 Quiz</Title>}
    >
      {!showResults ? (
        <div>
          <div style={{ marginBottom: 20 }}>
            <Text>Question {currentQuestion + 1} of {quizData.length}</Text>
          </div>
          <Title level={5}>{quizData[currentQuestion].question}</Title>
          <Radio.Group
            onChange={handleAnswer}
            value={selectedAnswers[currentQuestion]}
            style={{ width: '100%', marginTop: 20 }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {quizData[currentQuestion].options.map((option, index) => (
                <Radio key={index} value={index} style={{ marginBottom: 10 }}>
                  {option}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Button
              type="primary"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === undefined}
            >
              {currentQuestion === quizData.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <Title level={4}>Quiz Results</Title>
          <Paragraph>
            You scored {calculateScore()} out of {quizData.length}
          </Paragraph>
          <div style={{ marginTop: 20 }}>
            {quizData.map((q, index) => (
              <div key={index} style={{ marginBottom: 20 }}>
                <Text strong>Question {index + 1}: {q.question}</Text>
                <br />
                <Text type={selectedAnswers[index] === q.answer ? 'success' : 'danger'}>
                  Your answer: {q.options[selectedAnswers[index]]}
                </Text>
                <br />
                <Text type="success">Correct answer: {q.options[q.answer]}</Text>
                {q.explanation && (
                  <Paragraph type="secondary" style={{ marginTop: 5 }}>
                    {q.explanation}
                  </Paragraph>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: 'right' }}>
            <Button onClick={resetQuiz} style={{ marginRight: 10 }}>Try Again</Button>
            <Button type="primary" onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

const LearnInfo = () => {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const summaryPoints = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tincidunt mauris eu risus. Vestibulum auctor dapibus neque.",
    "Praesent placerat risus quis eros. Fusce pellentesque suscipit nibh. Cras ornare tristique elit. Vivamus vestibulum ntulla nec ante.",
    "Cras ornare tristique elit. Vivamus vestibulum ntulla nec ante.",
    "Nunc dignissim risus id metus. Cras ornare tristique elit. Vivamus vestibulum ntulla nec ante. Praesent placerat risus quis eros. Fusce pellentesque suscipit nibh.",
  ];

  const handleStartQuiz = () => {
    navigate('/menstrual-cycle-quiz');
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
            <img src={learnImage} alt="Learning about fertility" style={{width:"100%"}}/>
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
                dataSource={[
                  { title: 'Understanding Cycle Hormones', duration: '4:16', completed: true },
                  { title: 'Menstrual Cycle 101', duration: '19:17', completed: false },
                  { title: 'Identifying the Fertile Window', duration: '10:45', completed: false },
                  { title: 'Timing Menstrual Cycle Bloodwork', duration: '6:09', completed: false }
                ]}
                renderItem={item => (
                  <List.Item style={{ padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
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
                  onClick={handleStartQuiz}
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
                    backgroundColor: '#A0A0A0',
                    borderColor: '#A0A0A0'
                  }}
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
                <Title level={3} style={{ color: '#EE3838', margin: 0 }}>Fertile Window</Title>
                <Button 
                  type="primary" 
                  style={{ 
                    backgroundColor: '#A0A0A0',
                    borderColor: '#A0A0A0'
                  }}
                >
                  Start Quiz
                </Button>
              </div>
              <Collapse 
                ghost
                expandIconPosition="end"
              >
                <Panel header={<Text strong style={{ color: '#EE3838' }} >Summary and Key Terms</Text>} key="1">
                  <div style={{ padding: '10px 0' }}>
                    Content for summary and key terms goes here
                  </div>
                </Panel>
              </Collapse>
            </div>

          </div>
        </Col>
      </Row>

      <div style={{ textAlign: "left", marginTop: '5%' , display:'none'}}>
        <Title level={4}>SUMMARY</Title>
        <List
          dataSource={summaryPoints}
          renderItem={(item) => (
            <List.Item style={{ padding: "4px 0", border: "none" }}>
              <Text>- {item}</Text>
            </List.Item>
          )}
        />
        <div style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            size="large"
            style={{
              backgroundColor: "#DAA520",
              borderColor: "#DAA520",
              color: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.2)",
            }}
          >
            Take Quiz!
          </Button>
        </div>
      </div>

      <div style={{ position: "relative", marginTop: "50px" }}>
        <Row
          style={{
            display: isMobile ? "none" : "flex",
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
            position: isMobile ? "relative" : "absolute",
            top: isMobile ? 0 : "50%",
            left: isMobile ? 0 : "50%",
            transform: isMobile ? 0 : "translate(-50%, -50%)",
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
              borderTopRightRadius: "10px",
              borderBottomRightRadius: "10px",
              borderBottomLeftRadius: "50px"
            }}
          >
            <p style={{ fontWeight: "bold" }}>Day 3 Bloodwork</p>
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
              marginTop: isMobile ? 10 : 0,
              borderTopRightRadius: "50px",
              borderBottomLeftRadius: "10px",
              borderTopLeftRadius: "10px"
            }}
          >
            <p style={{ fontWeight: "bold" }}>Peak +7 Bloodwork</p>
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

      <QuizModal
        visible={showQuiz}
        onClose={() => setShowQuiz(false)}
        quizData={menstrualCycleQuizData}
      />
    </div>
  );
};

export default LearnInfo;
