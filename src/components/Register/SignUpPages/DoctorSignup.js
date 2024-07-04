import { useState } from "react";
import "../Register.css";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import CustomModal from "../../global_component/CustomModal";
import { postRegister } from "../../redux/AuthController";
import { useDispatch } from "react-redux";
import { Row, Col, Card } from "antd";
import "./SignupPages.css"
import { Form, Input, Button, Checkbox, DatePicker, Spin, notification, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import image1 from '../../../assets/images/bg/patient_bg.jpeg';
import image2 from '../../../assets/images/bg/patient2_bg.png';


const PatientSignup = (userRole) => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] = useState(false);
  const { Dragger } = Upload;
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const { Item: FormItem } = Form;

  const initialValues = {
    role: userRole?.userRole || "4",
    userName: "",
    firstName: "",
    lastName: "",
    gender: "Female",
    password: "",
    cpassword: "",
    email: "",
    address: "",
    appartmentOrSuite: "",
    country: "",
    stateProvince: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    medicalNumberOrProvinceHealthNumber: "",
    dob: "",
    height: "",
    weight: "",
    isSMS: "",
    isAgreeToShareInformation: "",
    isAcceptTermsAndCondition: "",
  };


  const uploadProps = {
    name: 'file',
    multiple: false,
    onChange(info) {
      const { fileList: newFileList } = info;
      setFileList(newFileList);
    },
    onPreview(file) {
      const url = URL.createObjectURL(file.originFileObj);
      window.open(url);
    },
  };

  const validateRegister = Yup.object({
    userName: Yup.string()
      .min(3, "User Name must be at least 3 characters")
      .required("Please enter user name"),
    firstName: Yup.string()
      .min(3, "First Name must be at least 3 characters")
      .required("Please enter first name"),
    lastName: Yup.string()
      .min(3, "Last Name must be at least 3 characters")
      .required("Please enter last name"),
    gender: Yup.string().required("Please select gender"),
    password: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Please enter password"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Please enter password"),
    email: Yup.string()
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Please enter a valid email"
      )
      .required("Please enter email"),
    address: Yup.string(),
    appartmentOrSuite: Yup.string(),
    country: Yup.string()
      .min(2, "Country must be at least 2 characters")
      .required("Please enter country name"),
    stateProvince: Yup.string()
      .min(3, "State Province must be at least 3 characters")
      .required("Please enter state/province name"),
    city: Yup.string()
      .min(3, "City must be at least 3 characters")
      .required("Please enter city name"),
    postalCode: Yup.string()
      .min(3, "Postal Code must be at least 3 characters")
      .required("Please enter postal code"),
    phoneNumber: Yup.string()
      .min(8, "Phone Number must be at least 8 characters")
      .required("Please enter phone number"),
    medicalNumberOrProvinceHealthNumber: Yup.string()
      .min(
        8,
        "Medical Number/ Province Health Number must be at least 8 characters"
      )
      .required("Please enter medical/provincial number"),
    // dob: Yup.date().required("Please select your date of birth"),
    dob: Yup.date()
      .required("Please select your date of birth")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "You must be 18 years or older"
      ),

    height: Yup.string()
      .matches(
        /^\d+(\.\d+)?$/,
        "Please enter a valid height (numbers/ decimals only)"
      )
      .required("Please enter height"),
    weight: Yup.string()
      .matches(
        /^\d+(\.\d+)?$/,
        "Please enter a valid weight (numbers/ decimals only)"
      )
      .required("Please enter weight"),
    isSMS: Yup.boolean(),
    isAgreeToShareInformation: Yup.boolean()
      .required("Please accept to share personal health information")
      .oneOf([true], "Please accept to share personal health information"),
    isAcceptTermsAndCondition: Yup.boolean()
      .required("Please accept terms and conditions")
      .oneOf([true], "Please accept terms and conditions"),
  });

  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notUsername: password !== username,
    };
    return validations;
  };

  const passwordValidations = validatePassword(password);
  const handleChange = (name) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const onFinish = async (values) => {
    console.log('Form values:', values);

    try {
      const { email, password } = values;

      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      notification.success({
        message: 'Successfully registered. Try Login Now!',
        description: 'Email and password stored successfully!',
        placement: 'topRight', // Position the notification on the top right
      });
      console.log('Stored in local storage:', { email, password });
    }
    catch (err) {
      console.log(err)
    }
    // await dispatch(postRegister(values));
    // Example of API call using fetch
    // fetch('https://your-api-endpoint', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(values),
    // })
    // .then(response => response.json())
    // .then(data => {
    //     console.log('API response:', data);
    //     // Handle API response
    // // })
    // .catch(error => {
    //     console.error('Error:', error);
    //     // Handle errors
    // });
  };

  const { values, errors, setValues } = useFormik({
    initialValues: initialValues,
    validationSchema: validateRegister,
    handleChange: handleChange,
    onSubmit: async (values) => {
      console.log({ values })
      setShowSpinner(true);
      await dispatch(postRegister(values));
      setShowSpinner(false);
    },
  });

  //#region Modal show
  const handleShowModal = () => {
    setShowTermsConditionsModal(true);
  };
  const handleCloseModal = () => {
    setShowTermsConditionsModal(false);
  };
  //#endregion
  const customizeRequiredMark = (label, { required }) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );
  return (
    <>
      <div className="">
        <div className="full-width-container">
          <Row gutter={16}>
          <Col span={8} className="column-1" style={{backgroundColor:'#CEF2F4'}}>
              <div className="image-container">
                <div style={{ padding: '15%' }}>
                  <img src={image1} alt="Top" className="image-1" style={{ borderRadius: '50px', height: '662px' }} />

                </div>
                <div style={{ padding: '15%' }}>

                  <img src={image2} alt="Bottom" className="image-2" style={{ borderRadius: '50px' }} />
                </div>
              </div>
            </Col>
            <Col span={16} className="column-2">
              <div className="form-scrollable">

                <div className="col-xl-9 col-lg-10 col-md-12">
                  <div className="card o-hidden border-0  my-3">
                    <nav className="navbar mt-3">
                      <img
                        className="float-left"
                        src={fertilityImage}
                        alt="login"
                        style={{ width: "150px" }}
                      />
                      <form className="d-flex" role="search">

                        <NavLink
                          to="/"
                          className="btn btn-user btn-block"
                          style={{backgroundColor:'rgb(1, 173, 240)' ,color:'#fff'}}

                        >
                          <span>Sign In</span>
                        </NavLink>
                      </form>
                    </nav>
                    <div className="card-body p-5">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="">
                            <p style={{ fontSize: 20, fontWeight: 700, color: '#000' }}>Let's get started</p>

                            <Form
                              layout="vertical"
                              onFinish={onFinish}
                              requiredMark={customizeRequiredMark}
                              initialValues={values}

                            >
                              <FormItem name="role" initialValue={values.role} rhidden>
                                <Input type="hidden" />
                              </FormItem>

                              <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="First Name"
                                    name="firstName"
                                    rules={[{ required: true, message: errors.firstName }]}
                                  >
                                    <Input placeholder="Enter First Name" />
                                  </FormItem>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="Last Name"
                                    name="lastName"
                                    rules={[{ required: true, message: errors.lastName }]}
                                  >
                                    <Input placeholder="Enter Last Name" />
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Username"
                                    name="userName"
                                    rules={[{ required: true, message: errors.userName }]}
                                  >
                                    <Input placeholder="Enter User Name"  onChange={(e) => setUsername(e.target.value)}/>
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row mb-2">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Password"
                                    name="password"
                                    rules={[{ required: true, message: errors.password }]}
                                  >
                                    <Input.Password placeholder="Enter Password" style={{ borderColor: '#000' }} onChange={(e) => setPassword(e.target.value)} />
                                  </FormItem>
                                </div>
                              </div>
                                 {password && ( <Card style={{ marginTop: '0' }}>
        <div>Password must contain:</div>
        <div style={{ color: passwordValidations.minLength ? 'green' : 'red' }}>
          {passwordValidations.minLength ? '✓' : '✗'} 12 characters minimum
        </div>
        <div style={{ color: passwordValidations.lowercase ? 'green' : 'red' }}>
          {passwordValidations.lowercase ? '✓' : '✗'} One lowercase character
        </div>
        <div style={{ color: passwordValidations.uppercase ? 'green' : 'red' }}>
          {passwordValidations.uppercase ? '✓' : '✗'} One uppercase character
        </div>
        <div style={{ color: passwordValidations.number ? 'green' : 'red' }}>
          {passwordValidations.number ? '✓' : '✗'} One number
        </div>
        <div style={{ color: passwordValidations.specialChar ? 'green' : 'red' }}>
          {passwordValidations.specialChar ? '✓' : '✗'} One special character
        </div>
        <div style={{ color: passwordValidations.notUsername ? 'green' : 'red' }}>
          {passwordValidations.notUsername ? '✓' : '✗'} Not the same as the username
        </div>
      </Card>)}
                              <div className="row mb-2">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Confirm Password"
                                    name="confirm password"
                                    rules={[{ required: true, message: errors.cpassword }]}
                                  >
                                    <Input.Password placeholder="Enter Confirm Password" style={{ borderColor: '#000' }} />
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: errors.email }]}
                                  >
                                    <Input type="email" placeholder="Enter Email Address..." />
                                  </FormItem>
                                </div>

                              </div>


                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[{ required: true, message: errors.phoneNumber }]}
                                  >
                                    <Input placeholder="Enter Phone Number" />
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="DOB"
                                    name="dob"
                                    rules={[{ required: true, message: errors.dob }]}
                                  >
                                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%', height: '42px', borderColor: '#000' }} />
                                  </FormItem>
                                </div>
                              </div>

                              <Form.Item
                                label="Credentials / License / Insurance"
                                name="credentials"
                                valuePropName="fileList"
                                getValueFromEvent={({ fileList }) => fileList}
                              >
                                <Dragger {...uploadProps}>
                                  <p className="ant-upload-drag-icon">
                                    <UploadOutlined color="#000" />
                                  </p>
                                  <p className="ant-upload-text">Upload / Drag and drop</p>
                                </Dragger>
                              </Form.Item>
                              <div className="row">
                             
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    name="isAcceptTermsAndCondition"
                                    valuePropName="checked"
                                    rules={[{ required: true, message: errors.isAcceptTermsAndCondition }]}
                                  >
                                    <Checkbox>
                                      I have read and accept the terms of the
                                      <span className="text-primary" onClick={handleShowModal}> Consent & Agreement</span>,
                                      <span className="text-primary" onClick={handleShowModal}> Terms of Services</span>, and
                                      <span className="text-primary" onClick={handleShowModal}>Privacy Policy</span>
                                    </Checkbox>
                                  </FormItem>
                                </div>
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={showSpinner}
          style={{ width: '409px', height: '46.42px',backgroundColor:'rgb(1, 173, 240)' }}
        >
          {showSpinner && <Spin size="small" />} CREATE ACCOUNT
        </Button>
      </div>
                              <div className="text-center">
                                <a className="small" href="/">Already have an account? Sign In</a>
                              </div>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>


        </div>
      </div>

      <CustomModal
        show={showTermsConditionsModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-white text-black font-weight-bold py-2"
        title={"Terms And Conditions"}
        body={
          <>
            <Row>
              <div className="d-flex flex-column col-md-8 offset-md-2 col-sm-12 mt-2 text-black">
                <center className="mb-3">
                  <p className="font-weight-bold">What is Lorem Ipsum?</p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting, remaining
                    essentially unchanged. It was popularised in the 1960s with
                    the release of Letraset sheets containing Lorem Ipsum
                    passages, and more recently with desktop publishing software
                    like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                  <p>
                    The standard chunk of Lorem Ipsum used since the 1500s is
                    reproduced below for those interested. Sections 1.10.32 and
                    1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are
                    also reproduced in their exact original form, accompanied by
                    English versions from the 1914 translation by H. Rackham.
                  </p>
                  <p className="font-weight-bold">Where can I get some?</p>
                  <p>
                    There are many variations of passages of Lorem Ipsum
                    available, but the majority have suffered alteration in some
                    form, by injected humour, or randomised words which don't
                    look even slightly believable. If you are going to use a
                    passage of Lorem Ipsum, you need to be sure there isn't
                    anything embarrassing hidden in the middle of text. All the
                    Lorem Ipsum generators on the Internet tend to repeat
                    predefined chunks as necessary, making this the first true
                    generator on the Internet. It uses a dictionary of over 200
                    Latin words, combined with a handful of model sentence
                    structures, to generate Lorem Ipsum which looks reasonable.
                    The generated Lorem Ipsum is therefore always free from
                    repetition, injected humour, or non-characteristic words
                    etc.
                  </p>
                </center>
              </div>
            </Row>
          </>
        }
        footer={
          <>
            <button
              className="btn btn-secondary mr-2"
              type="button"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </>
        }
      />
    </>
  );
};

export default PatientSignup;
