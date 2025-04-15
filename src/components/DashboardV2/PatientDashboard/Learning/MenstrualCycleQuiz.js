import React, { useState } from 'react';
import { Button, Typography, Radio, Space } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

const MenstrualCycleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  const handleAnswer = (e) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: e.target.value
    });
  };

  const handleNext = () => {
    if (currentQuestion < menstrualCycleQuizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.keys(selectedAnswers).forEach(question => {
      if (selectedAnswers[question] === menstrualCycleQuizData[question].answer) {
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
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Button 
            type="link" 
            icon={<LeftOutlined />} 
            onClick={handleBack}
            style={{ color: '#8B3A8B', paddingLeft: 0 }}
          >
            Back to Learn
          </Button>
        </div>
        
        <Title level={2} style={{ color: '#8B3A8B', marginBottom: '24px' }}>
          MENSTRUAL CYCLE 101 QUIZ
        </Title>

        <div style={{ maxWidth: '800px' }}>
          <Title level={4}>Welcome!</Title>
          
          <Paragraph>
            This is a great chance to assess how much you've learned. The questions will focus on the{' '}
            <Text style={{ color: '#8B3A8B' }}>Menstrual Cycle 101</Text>, so make sure you review as much as needed.
          </Paragraph>
          
          <Paragraph>
            You will need a <Text strong>100%</Text> in order to pass.
          </Paragraph>
          
          <Paragraph>
            But don't worry – you have multiple attempts!
          </Paragraph>
          
          <Paragraph>
            Our goal is to make sure you have the knowledge and confidence to successfully track your health!
          </Paragraph>
          
          <Paragraph>
            Goodluck!
          </Paragraph>

          <div style={{ marginTop: '40px' }}>
            <Button 
              type="primary"
              size="large"
              onClick={() => setQuizStarted(true)}
              style={{ 
                backgroundColor: '#8B3A8B',
                borderColor: '#8B3A8B',
                padding: '0 40px',
                height: '48px',
                borderRadius: '24px'
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
    const passed = score === menstrualCycleQuizData.length;

    return (
      <div style={{ padding: '24px', maxWidth: '800px' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>Quiz Results</Title>
        
        <div style={{ 
          padding: '24px',
          background: passed ? '#F6FFED' : '#FFF2F0',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <Title level={4} style={{ color: passed ? '#52C41A' : '#FF4D4F' }}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </Title>
          <Paragraph>
            You scored {score} out of {menstrualCycleQuizData.length}
          </Paragraph>
        </div>

        <div style={{ marginBottom: '40px' }}>
          {menstrualCycleQuizData.map((q, index) => (
            <div key={index} style={{ marginBottom: '24px' }}>
              <Text strong>Question {index + 1}: {q.question}</Text>
              <br />
              <Text type={selectedAnswers[index] === q.answer ? 'success' : 'danger'}>
                Your answer: {q.options[selectedAnswers[index]]}
              </Text>
              <br />
              <Text type="success">Correct answer: {q.options[q.answer]}</Text>
              {q.explanation && (
                <Paragraph type="secondary" style={{ marginTop: '8px' }}>
                  {q.explanation}
                </Paragraph>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={resetQuiz} style={{ marginRight: '12px' }}>
            Try Again
          </Button>
          <Button type="primary" onClick={handleBack} style={{ backgroundColor: '#8B3A8B', borderColor: '#8B3A8B' }}>
            Back to Learn
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="link" 
          icon={<LeftOutlined />} 
          onClick={handleBack}
          style={{ color: '#8B3A8B', paddingLeft: 0 }}
        >
          Back to Learn
        </Button>
      </div>

      <div style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Text>Question {currentQuestion + 1} of {menstrualCycleQuizData.length}</Text>
        </div>

        <Title level={4}>{menstrualCycleQuizData[currentQuestion].question}</Title>

        <Radio.Group
          onChange={handleAnswer}
          value={selectedAnswers[currentQuestion]}
          style={{ width: '100%', marginTop: '24px' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {menstrualCycleQuizData[currentQuestion].options.map((option, index) => (
              <Radio 
                key={index} 
                value={index} 
                style={{ 
                  marginBottom: '16px',
                  padding: '12px',
                  width: '100%',
                  border: '1px solid #D9D9D9',
                  borderRadius: '8px'
                }}
              >
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>

        <div style={{ marginTop: '40px', textAlign: 'right' }}>
          <Button
            type="primary"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            style={{ 
              backgroundColor: '#8B3A8B',
              borderColor: '#8B3A8B',
              padding: '0 40px',
              height: '48px',
              borderRadius: '24px'
            }}
          >
            {currentQuestion === menstrualCycleQuizData.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MenstrualCycleQuiz; 