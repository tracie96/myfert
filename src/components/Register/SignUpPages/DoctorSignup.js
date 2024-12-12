import { useState, useEffect, useCallback } from "react";
import "../Register.css";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import CustomModal from "../../global_component/CustomModal";
import {
  postRegister,
  validateEmail,
  validateUsername,
} from "../../redux/AuthController";
import { useDispatch } from "react-redux";
import { Row, Col, Card } from "antd";
import "./SignupPages.css";
import { Form, Input, Button, Checkbox, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import EmailVerificationModal from "./OTPModal";
import ReactInputMask from "react-input-mask";
import { useLocation } from "react-router-dom";

const DoctorSignup = ({ userRole }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] =
    useState(false);
  const { Dragger } = Upload;
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  let confirmPassword = "";
  const [email, setEmail] = useState("");
  const [usernameCheck, setUsernameCheck] = useState("");
  const [emailCheck, setEmailCheck] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [emailVerificationVisible, setEmailVerificationVisible] =
    useState(false);

  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
    notUsername: false,
  });
  const [username, setUsername] = useState("");
  const { Item: FormItem } = Form;
  console.log(location.state, "pro");
  const initialValues = {
    role: location.state?.role,
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
    isSMS: true,
    IsSendResultToEmail: true,
    isAgreeToShareInformation: false,
    isAcceptTermsAndCondition: false,
    isAssessor: location.state?.isAccessor,
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://api.cloudinary.com/v1_1/tracysoft/upload', 
    data: {
      upload_preset: 'myfertility',
    },
    onChange(info) {
      const { status } = info.file;

      if (status === 'done') {
        const url = info.file.response.secure_url; 
        setUploadedFileUrl(url);
        message.success(`${info.file.name} file uploaded successfully!`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleEmailVerificationCancel = () => {
    setEmailVerificationVisible(false);
    handleEmailBlur();
    handleUsernameBlur();
    setShowSpinner(false);
  };
  const handleEmailVerificationVerify = () => {
    setEmailVerificationVisible(false);
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
        "Please enter a valid email",
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
        "Medical Number/ Province Health Number must be at least 8 characters",
      )
      .required("Please enter medical/provincial number"),
    // dob: Yup.date().required("Please select your date of birth"),
    dob: Yup.date()
      .required("Please select your date of birth")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "You must be 18 years or older",
      ),

    height: Yup.string()
      .matches(
        /^\d+(\.\d+)?$/,
        "Please enter a valid height (numbers/ decimals only)",
      )
      .required("Please enter height"),
    weight: Yup.string()
      .matches(
        /^\d+(\.\d+)?$/,
        "Please enter a valid weight (numbers/ decimals only)",
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

  useEffect(() => {
    const validatePassword = (password) => {
      const validations = {
        minLength: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        notUsername: password !== username,
      };
      return validations;
    };

    const validations = validatePassword(password);
    setPasswordValidations(validations);
  }, [password, username]);

  const handleChange = (name) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    if (name === "userName") {
      setUsername(value);
    }
    if (name === "email") {
      setEmail(value);
    }
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFinish = async (values) => {
    if (
      (usernameCheck && usernameCheck.statusCode !== "200") ||
      (emailCheck && emailCheck.statusCode !== "200")
    ) {
      message.error("Please input a valid email or username!");
      return;
    }
    try {
      setShowSpinner(true); // Show the spinner while processing
      const processedValues = {
        ...values,
        isSMS: true,
        isAgreeToShareInformation: true,
        dob: "2021-03-03",
        isAssessor: false,
        isAccessor: false,
        height: 0, // Ensure height is a number
        weight: 0,
        MetricImperial: true,
        ExistOnMira: false,
        AgreeToUseData: true,
        DigitalSignature: '',
        licenseDocument:uploadedFileUrl,
        IsSendResultToEmail: true,
        IAgreeToReceiveInformation: true,
      };
      console.log("Processed Values:", processedValues);

      const response = await dispatch(postRegister(processedValues));
      if (response && response?.meta?.requestStatus === "fulfilled") {
        setTimeout(() => {
          setEmailVerificationVisible(true);
        }, 1000);
      } else {
        message.error(
          "Registration failed. Please check your details and try again.",
        );
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      message.error(
        "There was an error submitting the form. Please try again.",
      ); // Display error message
    } finally {
      setShowSpinner(false); // Hide the spinner after processing
    }
  };

  const { values, setValues } = useFormik({
    initialValues: initialValues,
    validationSchema: validateRegister,
    handleChange: handleChange,
    onSubmit: async (values) => {
      setShowSpinner(true);
      await dispatch(postRegister(values));
      setShowSpinner(false);
    },
  });

  const handleUsernameBlur = useCallback(async () => {
    const username = values.userName;
    if (username) {
      try {
        const result = await dispatch(validateUsername(username));
        if (validateUsername.fulfilled.match(result)) {
          setUsernameCheck(result.payload);
        } else {
          setUsernameCheck(null);
        }
      } catch (error) {
        console.error("Error validating username:", error);
      }
    } else {
      setUsernameCheck(null);
    }
  }, [dispatch, values.userName]);

  const handleEmailBlur = useCallback(async () => {
    const email = values.email;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email) {
      if (!emailRegex.test(email)) {
        setEmailCheck({ error: true, message: "Please enter a valid email" });
        return;
      }

      try {
        const result = await dispatch(validateEmail(email));
        if (validateEmail.fulfilled.match(result)) {
          setEmailCheck(result.payload);
        } else {
          setEmailCheck(null);
        }
      } catch (error) {
        console.error("Error validating email:", error);
      }
    } else {
      setEmailCheck(null);
    }
  }, [dispatch, values.email]);

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
        <div className="" style={{ background: "#fff" }}>
          <Row gutter={12}>
            <Col
              span={2}
              className="column-1"
              style={{ backgroundColor: "#CEF2F4" }}
            ></Col>
            <Col span={20} className="column-2">
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
                          style={{
                            backgroundColor: "rgb(1, 173, 240)",
                            color: "#fff",
                          }}
                        >
                          <span>Sign In</span>
                        </NavLink>
                      </form>
                    </nav>
                    <div className="card-body p-5">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="">
                            <p
                              style={{
                                fontSize: 20,
                                fontWeight: 700,
                                color: "#000",
                              }}
                            >
                              Welcome {location.state?.name}, Let's get started
                            </p>

                            <Form
                              layout="vertical"
                              onFinish={handleFinish}
                              requiredMark={customizeRequiredMark}
                              initialValues={values}
                            >
                              <FormItem
                                name="role"
                                initialValue={values.role}
                                rhidden
                              >
                                <Input type="hidden" />
                              </FormItem>

                              <div className="row">
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="First Name"
                                    name="firstName"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! Please enter your first name",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Enter First Name" />
                                  </FormItem>
                                </div>
                                <div className="col-lg-6 col-sm-12">
                                  <FormItem
                                    label="Last Name"
                                    name="lastName"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! Please enter your last name",
                                      },
                                    ]}
                                  >
                                    <Input placeholder="Enter User Name" />
                                  </FormItem>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <Form.Item
                                    label="Username"
                                    name="userName"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! Please enter your username.",
                                      },
                                    ]}
                                    validateStatus={
                                      usernameCheck
                                        ? usernameCheck.statusCode === "200"
                                          ? "success"
                                          : "error"
                                        : ""
                                    }
                                    help={
                                      usernameCheck && (
                                        <div
                                          style={{
                                            color:
                                              usernameCheck.statusCode === "200"
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          {usernameCheck.message}
                                        </div>
                                      )
                                    }
                                  >
                                    <Input
                                      placeholder="Enter User Name"
                                      onBlur={handleUsernameBlur}
                                      onChange={handleChange("userName")}
                                    />
                                  </Form.Item>
                                </div>
                              </div>

                              <div className="row mb-2">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Password"
                                    name="password"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! Please enter your password.",
                                      },
                                    ]}
                                  >
                                    <Input.Password
                                      placeholder="Enter Password"
                                      style={{ borderColor: "#000" }}
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      onBlur={() => {
                                        setPasswordFocused(false);
                                      }}
                                      onFocus={() => setPasswordFocused(true)}
                                    />
                                  </FormItem>
                                </div>
                              </div>
                              {passwordFocused && (
                                <Card style={{ marginTop: "0" }}>
                                  <div>Password must contain:</div>
                                  <div
                                    style={{
                                      color: passwordValidations.minLength
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.minLength ? "✓" : "✗"}{" "}
                                    8 characters minimum
                                  </div>
                                  <div
                                    style={{
                                      color: passwordValidations.lowercase
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.lowercase ? "✓" : "✗"}{" "}
                                    One lowercase character
                                  </div>
                                  <div
                                    style={{
                                      color: passwordValidations.uppercase
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.uppercase ? "✓" : "✗"}{" "}
                                    One uppercase character
                                  </div>
                                  <div
                                    style={{
                                      color: passwordValidations.number
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.number ? "✓" : "✗"} One
                                    number
                                  </div>
                                  <div
                                    style={{
                                      color: passwordValidations.specialChar
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.specialChar
                                      ? "✓"
                                      : "✗"}{" "}
                                    One special character
                                  </div>
                                  <div
                                    style={{
                                      color: passwordValidations.notUsername
                                        ? "green"
                                        : "red",
                                    }}
                                  >
                                    {passwordValidations.notUsername
                                      ? "✓"
                                      : "✗"}{" "}
                                    Not the same as the username
                                  </div>
                                </Card>
                              )}
                              <div className="row mb-2">
                                <div className="col-lg-12 col-sm-12">
                                  <Form.Item
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    rules={[
                                      { required: true, message: "" },
                                      {
                                        validator: (_, value) =>
                                          value === password
                                            ? Promise.resolve()
                                            : Promise.reject(
                                              "Passwords do not match",
                                            ),
                                      },
                                    ]}
                                  >
                                    <Input.Password value={confirmPassword} />
                                  </Form.Item>
                                </div>
                              </div>

                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <Form.Item
                                    label="Email"
                                    name="email"
                                    placeholder="Enter Email Address"
                                    help={
                                      emailCheck && (
                                        <div
                                          style={{
                                            color:
                                              emailCheck.statusCode === "200"
                                                ? "green"
                                                : "red",
                                          }}
                                        >
                                          {emailCheck.message}
                                        </div>
                                      )
                                    }
                                    rules={[
                                      {
                                        required: true,
                                        message: "Please input your email!",
                                      },
                                    ]}
                                  >
                                    <Input
                                      value={email}
                                      onBlur={handleEmailBlur}
                                      onChange={handleChange("email")}
                                    />
                                  </Form.Item>
                                </div>
                              </div>

                              <div
                                style={{
                                  textAlign: "center",
                                  background: "#d6deef",
                                  color: "#335CAD",
                                  padding: 5,
                                  width: "90%",
                                  margin: "auto",
                                  borderRadius: 10,
                                  marginBottom: 10,
                                }}
                              >
                                Please use the same email you signed up with for
                                both Mira and the Jane app
                              </div>
                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    label="Phone Number"
                                    name="phoneNumber"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! Please enter your Phone number",
                                      },
                                    ]}
                                  >
                                    <ReactInputMask
                                      mask="+1 (999) 999-9999"
                                      maskChar={null}
                                    >
                                      {(inputProps) => (
                                        <Input
                                          {...inputProps}
                                          placeholder="Enter Phone Number"
                                        />
                                      )}
                                    </ReactInputMask>
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
                                    <UploadOutlined />
                                  </p>
                                  <p className="ant-upload-text">Upload / Drag and drop</p>
                                </Dragger>
                              </Form.Item>

                         
                              <div className="row">
                                <div className="col-lg-12 col-sm-12">
                                  <FormItem
                                    name="isAcceptTermsAndCondition"
                                    valuePropName="checked"
                                    rules={[
                                      {
                                        required: true,
                                        message:
                                          "! You must agree to the terms and conditions to proceed.",
                                      },
                                    ]}
                                  >
                                    <Checkbox>
                                      I have read and accept the terms of the
                                      <span
                                        className="text-primary"
                                        onClick={handleShowModal}
                                      >
                                        {" "}
                                        Consent & Agreement
                                      </span>
                                      ,
                                      <span
                                        className="text-primary"
                                        onClick={handleShowModal}
                                      >
                                        {" "}
                                        Terms of Services
                                      </span>
                                      , and
                                      <span
                                        className="text-primary"
                                        onClick={handleShowModal}
                                      >
                                        Privacy Policy
                                      </span>
                                    </Checkbox>
                                  </FormItem>
                                </div>
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  block
                                  disabled={showSpinner}
                                  style={{
                                    width: "409px",
                                    height: "46.42px",
                                    backgroundColor: "rgb(1, 173, 240)",
                                  }}
                                >
                                  {showSpinner && <Spin size="small" />} CREATE
                                  ACCOUNT
                                </Button>
                              </div>
                              <div className="text-center">
                                <a className="small" href="/">
                                  Already have an account? Sign In
                                </a>
                              </div>
                            </Form>

                            <EmailVerificationModal
                              visible={emailVerificationVisible}
                              onCancel={handleEmailVerificationCancel}
                              onVerify={handleEmailVerificationVerify}
                              email={values.email}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col
              span={2}
              className="column-3"
              style={{ backgroundColor: "#CEF2F4" }}
            ></Col>
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

export default DoctorSignup;
