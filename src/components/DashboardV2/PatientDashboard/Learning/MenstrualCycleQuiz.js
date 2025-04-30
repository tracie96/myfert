import React, { useState } from 'react';
import { Button, Typography, Radio, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

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
    explanation: "The menstrual cycle consists of two main phases: the Follicular Phase (before ovulation) and the Luteal Phase (after ovulation)."
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
    explanation: "These four hormones work together to regulate the menstrual cycle and ovulation."
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
    explanation: "All of these biomarkers can be used to track and understand your menstrual cycle."
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

const fertileWindowQuizData = [
  {
    question: "What type of cervical mucus indicates peak fertility?",
    options: [
      "Thick and sticky",
      "Dry or absent",
      "Clear/semi-clear, stretchy, and/or slippery (resembling egg whites)",
      "Cloudy and pasty"
    ],
    answer: 2,
    explanation: "This type of cervical mucus creates an ideal environment for sperm to swim and survive."
  },
  {
    question: "What does a rise in estrogen indicate in the menstrual cycle?",
    options: [
      "The start of menstruation",
      "Ovulation is likely imminent",
      "Fertility is declining",
      "Hormonal imbalance"
    ],
    answer: 1,
    explanation: "A rise in estrogen signals the body is approaching the ovulatory phase and may soon trigger an LH surge."
  },
  {
    question: "How might estrogen patterns differ in people with PCOS or in cycles with delayed ovulation?",
    options: [
      "Estrogen levels remain low throughout the cycle",
      "Estrogen may rise and fall multiple times before ovulation occurs",
      "Estrogen only rises once during the cycle",
      "PCOS does not affect estrogen patterns throughout the cycle"
    ],
    answer: 1,
    explanation: "People with PCOS often experience irregular cycles, and fluctuating estrogen levels can indicate failed attempts at ovulation."
  },
  {
    question: "How do threshold LH (Luteinizing Hormone) tests help to identify ovulation?",
    options: [
      "By testing only once at the beginning of the cycle",
      "By identifying the first appearance of cervical mucus",
      "By detecting a significant surge in LH, usually 24-36 hours before ovulation",
      "By confirming with a progesterone blood test"
    ],
    answer: 2,
    explanation: "LH tests identify the hormonal surge that triggers ovulation, helping users predict the likely timing of ovulation and therefore their most fertile days."
  },
  {
    question: "When is intercourse most likely to result in pregnancy during the menstrual cycle?",
    options: [
      "Any time during the menstrual cycle",
      "Only on the day of ovulation",
      "During the 5 days leading up to ovulation and on the day of ovulation",
      "After ovulation has occurred"
    ],
    answer: 2,
    explanation: "Sperm can survive for up to 5 days in cervical mucus, and having intercourse throughout the fertile window maximizes the chances of sperm meeting the egg."
  },
  {
    question: "What day provides the highest likelihood of conception?",
    options: [
      "The day before ovulation",
      "5 days before ovulation",
      "7 days after ovulation",
      "The first day after your menstrual period ends"
    ],
    answer: 0,
    explanation: "It is best to have intercourse throughout the fertile window because you cannot predict the exact day of ovulation. When you are starting to feel slippery at the vulva is a great indication of high estrogen levels, and therefore likely imminent ovulation. LH tests can also help to pinpoint the day before ovulation."
  },
  {
    question: "During the fertile window, is it better to have intercourse every day or every other day?",
    options: [
      "Every day, to maximize the chances of fertilization",
      "Every other day, to maintain optimal sperm quality",
      "Once during the fertile window is sufficient",
      "Only on the day of ovulation",
      "All of the above"
    ],
    answer: 4,
    explanation: "It only takes one well-timed act of intercourse to conceive, and there is no strong evidence pointing to specific frequency within the fertile window leading to better chances. However, because we can't know the exact day of ovulation it's best to start trying when signs point to high estrogen (e.g., seeing peak type cervical mucus), and therefore an ovulation attempt."
  },
  {
    question: "How long can sperm survive in the reproductive tract during the fertile window, aided by high estrogen levels and estrogenic cervical mucus?",
    options: [
      "1 day",
      "2-3 days",
      "Up to 5 days",
      "7-10 days"
    ],
    answer: 2,
    explanation: "High estrogen levels during the fertile window lead to the production of estrogenic cervical mucus, which creates an ideal environment for sperm to survive for up to 5 days, increasing the chances of fertilization."
  },
  {
    question: "For individuals with PCOS or those that often experience delayed ovulation (irregular cycles), when should they assume they are in their fertile window?",
    options: [
      "Only after an LH surge is detected",
      "Anytime during an estrogen rise",
      "On cycle day 14",
      "During menstruation"
    ],
    answer: 1,
    explanation: "In individuals with PCOS or those that often experience delayed ovulation (irregular cycles), multiple estrogen rises may occur without ovulation. It is safer to assume fertility any time estrogen levels are rising, as ovulation could potentially follow. Waiting for an LH surge can result in missed opportunities, and since LH baseline levels are generally higher in those with PCOS, LH tests may be hard to interpret."
  }
];

const MenstrualCycleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const quizType = location.state?.quizType || 'menstrual';
  const colors = location.state?.colors || {
    primary: '#8B3A8B',
    text: '#8B3A8B',
    background: '#F8F0F8',
    buttonColor: '#8B3A8B'
  };

  const quizData = quizType === 'menstrual' ? menstrualCycleQuizData : fertileWindowQuizData;
  const quizTitle = quizType === 'menstrual' ? 'MENSTRUAL CYCLE 101 QUIZ' : 'FERTILE WINDOW QUIZ';

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
    setQuizStarted(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!quizStarted) {
    return (
      <div style={{ 
        padding: window.innerWidth <= 480 ? '16px' : '24px',
        maxWidth: '100%',
        overflowX: 'hidden'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <Button 
            type="link" 
            icon={<LeftOutlined />} 
            onClick={handleBack}
            style={{ color: colors.text, paddingLeft: 0 }}
          >
            Back to Learn
          </Button>
        </div>
        
        <Title level={2} style={{ 
          color: colors.text, 
          marginBottom: '24px',
          fontSize: window.innerWidth <= 480 ? '24px' : '30px'
        }}>
          {quizTitle}
        </Title>

        <div style={{ maxWidth: '800px' }}>
          <Title level={4} style={{ fontSize: window.innerWidth <= 480 ? '18px' : '20px' }}>Welcome!</Title>
          
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            This is a great chance to assess how much you've learned. The questions will focus on the{' '}
            <Text style={{ color: colors.text }}>{quizType === 'menstrual' ? 'Menstrual Cycle 101' : 'Fertile Window'}</Text>, so make sure you review as much as needed.
          </Paragraph>
          
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            You will need a <Text strong>100%</Text> in order to pass.
          </Paragraph>
          
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            But don't worry – you have multiple attempts!
          </Paragraph>
          
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            Our goal is to make sure you have the knowledge and confidence to successfully track your health!
          </Paragraph>
          
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            Goodluck!
          </Paragraph>

          <div style={{ 
            marginTop: '40px',
            display: 'flex',
            justifyContent: window.innerWidth <= 480 ? 'center' : 'flex-start'
          }}>
            <Button 
              type="primary"
              size="large"
              onClick={() => setQuizStarted(true)}
              style={{ 
                backgroundColor: colors.buttonColor,
                borderColor: colors.buttonColor,
                padding: '0 40px',
                height: '48px',
                borderRadius: '24px',
                width: window.innerWidth <= 480 ? '100%' : 'auto'
              }}
            >
              Start Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score === quizData.length;

    if (passed) {
      localStorage.setItem('quizPassed', 'true');
    }

    return (
      <div style={{ 
        padding: window.innerWidth <= 480 ? '16px' : '24px', 
        maxWidth: '800px',
        overflowX: 'hidden'
      }}>
        <Title level={2} style={{ 
          marginBottom: '24px',
          fontSize: window.innerWidth <= 480 ? '24px' : '30px'
        }}>Quiz Results</Title>
        
        <div style={{ 
          padding: window.innerWidth <= 480 ? '16px' : '24px',
          background: passed ? '#F6FFED' : '#FFF2F0',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Title level={4} style={{ 
            color: passed ? '#52C41A' : '#FF4D4F',
            fontSize: window.innerWidth <= 480 ? '18px' : '20px'
          }}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </Title>
          <Paragraph style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            You scored {score} out of {quizData.length}
          </Paragraph>
        </div>

        <div style={{ marginBottom: '40px' }}>
          {quizData.map((q, index) => (
            <div key={index} style={{ 
              marginBottom: '24px',
              padding: window.innerWidth <= 480 ? '16px' : '24px',
              border: '1px solid #f0f0f0',
              borderRadius: '8px'
            }}>
              <Text strong style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
                Question {index + 1}: {q.question}
              </Text>
              <br />
              <Text 
                type={selectedAnswers[index] === q.answer ? 'success' : 'danger'}
                style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}
              >
                Your answer: {q.options[selectedAnswers[index]]}
              </Text>
              <br />
              <Text 
                type="success"
                style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}
              >
                Correct answer: {q.options[q.answer]}
              </Text>
              {q.explanation && (
                <Paragraph 
                  type="secondary" 
                  style={{ 
                    marginTop: '8px',
                    fontSize: window.innerWidth <= 480 ? '14px' : '16px'
                  }}
                >
                  {q.explanation}
                </Paragraph>
              )}
            </div>
          ))}
        </div>

        <div style={{ 
          textAlign: 'right',
          display: 'flex',
          flexDirection: window.innerWidth <= 480 ? 'column' : 'row',
          gap: window.innerWidth <= 480 ? '12px' : '0',
          justifyContent: window.innerWidth <= 480 ? 'stretch' : 'flex-end'
        }}>
          <Button 
            onClick={resetQuiz} 
            style={{ 
              marginRight: window.innerWidth <= 480 ? '0' : '12px',
              width: window.innerWidth <= 480 ? '100%' : 'auto'
            }}
          >
            Try Again
          </Button>
          <Button 
            type="primary" 
            onClick={handleBack} 
            style={{ 
              backgroundColor: colors.buttonColor, 
              borderColor: colors.buttonColor,
              width: window.innerWidth <= 480 ? '100%' : 'auto'
            }}
          >
            Back to Learn
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: window.innerWidth <= 480 ? '16px' : '24px',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="link" 
          icon={<LeftOutlined />} 
          onClick={handleBack}
          style={{ color: colors.text, paddingLeft: 0 }}
        >
          Back to Learn
        </Button>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: window.innerWidth <= 480 ? '14px' : '16px' }}>
            Question {currentQuestion + 1} of {quizData.length}
          </Text>
        </div>

        <Title level={4} style={{ fontSize: window.innerWidth <= 480 ? '18px' : '20px' }}>
          {quizData[currentQuestion].question}
        </Title>

        <Radio.Group
          onChange={handleAnswer}
          value={selectedAnswers[currentQuestion]}
          style={{ width: '100%', marginTop: '24px' }}
        >
          <Space 
            direction="vertical" 
            style={{ width: '100%' }}
          >
            {quizData[currentQuestion].options.map((option, index) => (
              <Radio 
                key={index} 
                value={index} 
                style={{ 
                  marginBottom: '16px',
                  padding: window.innerWidth <= 480 ? '8px' : '12px',
                  width: '100%',
                  border: '1px solid #D9D9D9',
                  borderRadius: '8px',
                  fontSize: window.innerWidth <= 480 ? '14px' : '16px'
                }}
              >
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div style={{ 
          marginTop: '40px', 
          textAlign: 'right',
          display: 'flex',
          justifyContent: window.innerWidth <= 480 ? 'stretch' : 'flex-end'
        }}>
          <Button
            type="primary"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            style={{ 
              backgroundColor: selectedAnswers[currentQuestion] === undefined ? '#999' : colors.buttonColor,
              borderColor: selectedAnswers[currentQuestion] === undefined ? '#D9D9D9' : colors.buttonColor,
              color: selectedAnswers[currentQuestion] === undefined ? '#FFFFFF' : undefined,
              padding: '0 40px',
              height: '48px',
              borderRadius: '24px',
              width: window.innerWidth <= 480 ? '100%' : 'auto'
            }}
          >
            {currentQuestion === quizData.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCycleQuiz; 