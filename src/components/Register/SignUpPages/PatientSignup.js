import { useState } from "react";
import "../Register.css";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import Spinner from "react-bootstrap/Spinner";
import CustomModal from "../../global_component/CustomModal";
import PasswordInput from "../../global_component/PasswordInput";
import { postRegister } from "../../redux/AuthController";
import { useDispatch } from "react-redux";
import { Row, Col, Card } from "antd";
import "./SignupPages.css"
import { Form, Input, Button, Checkbox, DatePicker, Spin, notification } from 'antd';
import Select from 'react-select';

import image1 from '../../../assets/images/bg/patient_bg.jpeg';
import image2 from '../../../assets/images/bg/patient2_bg.png';


const PatientSignup = (userRole) => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] =
    useState(false);
  const { Item: FormItem } = Form;
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
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
  const countries = [
    { label: 'USA', value: 'USA' },
    { label: 'Canada', value: 'Canada' },
  ];
  const [selectedCountry, setSelectedCountry] = useState(null); // Ensure setSelectedCountry is defined here
  const [form] = Form.useForm();
const states = {
  USA: [
    { label: 'Alabama', value: 'AL' },
    { label: 'Alaska', value: 'AK' },
    { label: 'Arizona', value: 'AZ' },
    { label: 'Arkansas', value: 'AR' },
    { label: 'California', value: 'CA' },
    { label: 'Colorado', value: 'CO' },
    { label: 'Connecticut', value: 'CT' },
    { label: 'Delaware', value: 'DE' },
    { label: 'Florida', value: 'FL' },
    { label: 'Georgia', value: 'GA' },
    { label: 'Hawaii', value: 'HI' },
    { label: 'Idaho', value: 'ID' },
    { label: 'Illinois', value: 'IL' },
    { label: 'Indiana', value: 'IN' },
    { label: 'Iowa', value: 'IA' },
    { label: 'Kansas', value: 'KS' },
    { label: 'Kentucky', value: 'KY' },
    { label: 'Louisiana', value: 'LA' },
    { label: 'Maine', value: 'ME' },
    { label: 'Maryland', value: 'MD' },
    { label: 'Massachusetts', value: 'MA' },
    { label: 'Michigan', value: 'MI' },
    { label: 'Minnesota', value: 'MN' },
    { label: 'Mississippi', value: 'MS' },
    { label: 'Missouri', value: 'MO' },
    { label: 'Montana', value: 'MT' },
    { label: 'Nebraska', value: 'NE' },
    { label: 'Nevada', value: 'NV' },
    { label: 'New Hampshire', value: 'NH' },
    { label: 'New Jersey', value: 'NJ' },
    { label: 'New Mexico', value: 'NM' },
    { label: 'New York', value: 'NY' },
    { label: 'North Carolina', value: 'NC' },
    { label: 'North Dakota', value: 'ND' },
    { label: 'Ohio', value: 'OH' },
    { label: 'Oklahoma', value: 'OK' },
    { label: 'Oregon', value: 'OR' },
    { label: 'Pennsylvania', value: 'PA' },
    { label: 'Rhode Island', value: 'RI' },
    { label: 'South Carolina', value: 'SC' },
    { label: 'South Dakota', value: 'SD' },
    { label: 'Tennessee', value: 'TN' },
    { label: 'Texas', value: 'TX' },
    { label: 'Utah', value: 'UT' },
    { label: 'Vermont', value: 'VT' },
    { label: 'Virginia', value: 'VA' },
    { label: 'Washington', value: 'WA' },
    { label: 'West Virginia', value: 'WV' },
    { label: 'Wisconsin', value: 'WI' },
    { label: 'Wyoming', value: 'WY' },
  ],
  Canada: [
    { label: 'Alberta', value: 'AB' },
    { label: 'British Columbia', value: 'BC' },
    { label: 'Manitoba', value: 'MB' },
    { label: 'New Brunswick', value: 'NB' },
    { label: 'Newfoundland and Labrador', value: 'NL' },
    { label: 'Northwest Territories', value: 'NT' },
    { label: 'Nova Scotia', value: 'NS' },
    { label: 'Nunavut', value: 'NU' },
    { label: 'Ontario', value: 'ON' },
    { label: 'Prince Edward Island', value: 'PE' },
    { label: 'Quebec', value: 'QC' },
    { label: 'Saskatchewan', value: 'SK' },
    { label: 'Yukon', value: 'YT' },
  ],
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

    try{
      const { email, password } = values;
      values.height = 0;
      values.weight = 0;
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      setShowSpinner(true);
      await dispatch(postRegister(values));
      setShowSpinner(false);
      notification.success({
        message: 'Successfully registered. Try Login Now!',
        description: 'Email and password stored successfully!',
        placement: 'topRight', // Position the notification on the top right
    });
      console.log('Stored in local storage:', { email, password });
    }
    catch(err){
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

  const { values, handleBlur, handleSubmit, errors, setValues } = useFormik({
    initialValues: initialValues,
    validationSchema: validateRegister,
    handleChange: handleChange,
    onSubmit: async (values) => {
      console.log({values})
      setShowSpinner(true);
      await dispatch(postRegister(values));
      setShowSpinner(false);
    },
  });
  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption);
    form.setFieldsValue({ stateProvince: null });
  };

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
            <Col span={8} className="column-1" style={{backgroundColor:'#EFD0BD'}}>
              <div className="image-container">
                <div style={{ padding: '15%' }}>
                  <img src={image1} alt="Top Image" className="image-1" style={{ borderRadius: '50px', height: '662px' }} />

                </div>
                <div style={{ padding: '15%' }}>

                  <img src={image2} alt="Bottom Image" className="image-2" style={{ borderRadius: '50px' }} />
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
                        alt="loginImage"
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
                                    <Input placeholder="Enter User Name" />
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
          
     {password && ( <Card>
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
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: errors.address }]}
                                  >
                                    <Input placeholder="Enter Address" />
                                  </FormItem>
                                </div>
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Apartment, Suite, etc"
                                    name="appartmentOrSuite"
                                    rules={[{ required: true, message: errors.appartmentOrSuite }]}
                                  >
                                    <Input placeholder="Enter Apartment Or Suite" />
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="Country"
                                    name="country"
                                    rules={[{ required: true, message: errors.country }]}
                                  >
                                              <Select
              options={countries}
              onChange={handleCountryChange}
              placeholder="Select Country"
            />
                                  </FormItem>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="State/Province"
                                    name="stateProvince"
                                    rules={[{ required: true, message: errors.stateProvince }]}
                                  >
    <Select
              options={selectedCountry ? states[selectedCountry.value] : []}
              placeholder="Select State/Province"
              isDisabled={!selectedCountry}
            />
                                         </FormItem>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="City"
                                    name="city"
                                    rules={[{ required: true, message: errors.city }]}
                                  >
                                    <Input placeholder="Enter City" />
                                  </FormItem>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="Postal Code"
                                    name="postalCode"
                                    rules={[{ required: true, message: errors.postalCode }]}
                                  >
                                    <Input placeholder="Enter Postal Code" />
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

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    name="isSMS"
                                    valuePropName="checked"
                                    rules={[{ required: true, message: errors.isSMS }]}
                                  >
                                    <Checkbox>I agree to receive SMS messages</Checkbox>
                                  </FormItem>
                                </div>
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    name="isAgreeToShareInformation"
                                    valuePropName="checked"
                                    rules={[{ required: true, message: errors.isAgreeToShareInformation }]}
                                  >
                                    <Checkbox>
                                      I agree to allow my personal health information to be shared with My Fertility Labs healthcare providers and authorize the use of anonymized data for research and development purposes, aimed at enhancing services for all users
                                    </Checkbox>
                                  </FormItem>
                                </div>
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    name="isAgreeToReceive"
                                    valuePropName="checked"
                                    rules={[{ required: true, message: errors.isAgreeToReceive }]}
                                  >
                                    <Checkbox>
                                      I agree to receive both online and in-person care and authorize the sharing of this information with healthcare personnel, including clinician, fertility coach, or other healthcare support, solely for the purpose of providing care to the individual or couple
                                    </Checkbox>
                                  </FormItem>
                                </div>
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
