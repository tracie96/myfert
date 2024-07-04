import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { postLogin } from '../redux/AuthController'; // Ensure you import forgotPassword action
import { Button, Input, Form, Row, Col, Divider, Typography, Modal } from 'antd'; // Import Modal, Spin from Ant Design
import fertilityImage from '../../assets/images/auth/fertilityImage.svg';
import Login_one from '../../assets/images/auth/login_one.png';
import Login_two from '../../assets/images/auth/login_two.png';
import Login_three from '../../assets/images/auth/login_three.png';
import Login_four from '../../assets/images/auth/login_four.png';

import './Login.css';
import ForgotPassword from '../ForgotPassword/ForgotPassword';

const { Text } = Typography;

const initialValues = {
  email: '',
  password: '',
};

const validateLogin = Yup.object().shape({
  email: Yup.string()
    .min(3, 'User Name must be at least 3 characters')
    .required('Please enter User Name or Email'),
  password: Yup.string()
    .min(3, 'Password must be at least 3 characters')
});

function Login() {
  const dispatch = useDispatch();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false); // State to control visibility of Forgot Password modal
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateLogin,
    onSubmit: (values) => {
      try {
        dispatch(postLogin(values));
      } catch (error) {
        console.log('login-page api call error: ' + error);
      }
    },
  });

  const data = useSelector((state) => state?.authentication?.userAuth);
  const { loading } = useSelector((state) => state?.authentication);

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true); // Show the Forgot Password modal
  };

  const handleCancelForgotPassword = () => {
    setShowForgotPasswordModal(false); // Close the Forgot Password modal
  };

  if (data && data.id) {
    return <Navigate to="/home" />;
  }

  return (
    <Row className="login-container">
      <Col xs={24} md={12} className="left-section">
        <div className="circle-image">
          <img src={Login_one} alt="Login One" />
        </div>
        <div className="circle-image">
          <img src={Login_two} alt="Login Two" />
        </div>
        <div className="circle-image">
          <img src={Login_three} alt="Login Three" />
        </div>
        <div className="circle-image">
          <img src={Login_four} alt="Login Four" />
        </div>
      </Col>
      <Col xs={24} md={12} className="right-section">
        <img src={fertilityImage} alt="Fertility" className="logo-image" />
        <div className="form-container">
          <Form className="user" onFinish={handleSubmit}>
            <Form.Item
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email}
            >
              <Input
                type="text"
                placeholder="Username or Email"
                value={values.email}
                onBlur={handleBlur('email')}
                onChange={handleChange('email')}
                style={{
                  height: '41px',
                  background: '#E4E5E7',
                  // textAlign: 'center',
                  border:'none'
                }}
              />
            </Form.Item>
            <Form.Item
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password}
              style={{textAlign:'center'}}
            >
 <Form.Item
  validateStatus={errors.password ? 'error' : ''}
  help={errors.password}
>
  <Input.Password
    placeholder="Password"
    value={values.password}
    onBlur={handleBlur('password')}
    onChange={handleChange('password')}
    style={{
      height: '41px',
      background: '#E4E5E7',
      border: 'none',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  />
</Form.Item>


            </Form.Item>
            <Form.Item style={{paddingTop:50}}> 
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                style={{
                  background:'#01ADF0',
                  height:'50px',
                  fontSize:'16px',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
            <Divider className="divider" />
            <div className="links">
              <Text onClick={handleForgotPassword} style={{ cursor: 'pointer' , color:'#01ADF0'}}>Forgot Password?</Text>
              <Text className="sign-up-link">
                Don't have an account? <NavLink to="/register">Sign Up</NavLink>
              </Text>
            </div>
          </Form>
        </div>
      </Col>

      {/* Forgot Password Modal */}
      <Modal
        width={1000}
        visible={showForgotPasswordModal}
        onCancel={handleCancelForgotPassword}
        footer={null}
      >
        <ForgotPassword />
      </Modal>
    </Row>
  );
}

export default Login;
