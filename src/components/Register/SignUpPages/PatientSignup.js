import { useState, useEffect, useCallback } from "react";
import "../Register.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import CustomModal from "../../global_component/CustomModal";
import {
  postRegister,
  validateEmail,
  validateUsername,
} from "../../redux/AuthController";
import { useDispatch } from "react-redux";
import { Row, Col, Card, message, Radio, Modal } from "antd";
import "./SignupPages.css";
import { Form, Input, Button, Checkbox, DatePicker, Spin, Steps } from "antd";
import Select from "react-select";
import EmailVerificationModal from "./OTPModal";
import ReactInputMask from "react-input-mask";
import moment from "moment/moment";
import dayjs from 'dayjs';
import { useMediaQuery } from "react-responsive";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import { NavLink } from "react-router-dom";

const PatientSignup = () => {

  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] =
    useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShowPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCollectionNoticeModal, setShowCollectionNoticeModal] = useState(false);
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [form] = Form.useForm();
  const { Item: FormItem } = Form;
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  let confirmPassword = "";
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [email, setEmail] = useState(null);
  const [usernameCheck, setUsernameCheck] = useState("");
  const [emailCheck, setEmailCheck] = useState(null);
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
  const [dob, setDob] = useState("");
  const [partnerDob, setPartnerDob] = useState("");
  console.log({partnerDob})
  const initialValues = {
    role: "4",
    userName: "",
    firstName: "",
    lastName: "",
    PreferredName: "",
    Pronouns: "",
    gender: "",
    password: "",
    cpassword: "",
    email: "",
    phoneNumber: "",
    address: "",
    appartmentOrSuite: "",
    country: "",
    stateProvince: "",
    city: "",
    postalCode: "",
    medicalNumberOrProvinceHealthNumber: "",
    dob: null,
    height: 0,
    weight: 0,
    uli:"",
    MetricImperial: false,
    isSMS: false,
    isSendResultToEmail: false,
    isAgreeToShareInformation: false,
    IAgreeToReceiveInformation: false,
    isAcceptTermsAndCondition: false,
    AgreeToUseData: false,
    DigitalSignature: false,
    DigitalSignatureName: null,
    ExistOnMira: false,
    isAssessor: false,
    licenseDocument: null,
    // Partner details
    PartnerFirstName: "",
    PartnerLastName: "",
    PartnerSex: "",
    PartnerPronouns: "",
    PartnerDob: null,
  };

  const requiredFields = [
    "isSMS",
    "isSendResultToEmail",
    "isAgreeToShareInformation",
    "isAcceptTermsAndCondition",
    "DigitalSignature",
    "DigitalSignatureName",
    "IAgreeToReceiveInformation",
  ];
  const countries = [
    { label: "USA", value: "USA" },
    { label: "Canada", value: "Canada" },
  ];
  const pronouns = [
    { label: "She/Her", value: "She/Her" },
    { label: "He/Him", value: "He/Him" },
    { label: "They/Them", value: "They/Them" },
  ];
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedPronoun, setSelectedPronoun] = useState(null);
  const [selectedPartnerPronoun, setSelectedPartnerPronoun] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [unit, setUnit] = useState("Metric");
  const [heightOfPatient, setHeightOfPatient] = useState('');
  const [weightOfPatient, setWeightOfPatient] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const startYear = 2007;

  const states = {
    USA: [
      { label: "Alabama", value: "AL" },
      { label: "Alaska", value: "AK" },
      { label: "Arizona", value: "AZ" },
      { label: "Arkansas", value: "AR" },
      { label: "California", value: "CA" },
      { label: "Colorado", value: "CO" },
      { label: "Connecticut", value: "CT" },
      { label: "Delaware", value: "DE" },
      { label: "Florida", value: "FL" },
      { label: "Georgia", value: "GA" },
      { label: "Hawaii", value: "HI" },
      { label: "Idaho", value: "ID" },
      { label: "Illinois", value: "IL" },
      { label: "Indiana", value: "IN" },
      { label: "Iowa", value: "IA" },
      { label: "Kansas", value: "KS" },
      { label: "Kentucky", value: "KY" },
      { label: "Louisiana", value: "LA" },
      { label: "Maine", value: "ME" },
      { label: "Maryland", value: "MD" },
      { label: "Massachusetts", value: "MA" },
      { label: "Michigan", value: "MI" },
      { label: "Minnesota", value: "MN" },
      { label: "Mississippi", value: "MS" },
      { label: "Missouri", value: "MO" },
      { label: "Montana", value: "MT" },
      { label: "Nebraska", value: "NE" },
      { label: "Nevada", value: "NV" },
      { label: "New Hampshire", value: "NH" },
      { label: "New Jersey", value: "NJ" },
      { label: "New Mexico", value: "NM" },
      { label: "New York", value: "NY" },
      { label: "North Carolina", value: "NC" },
      { label: "North Dakota", value: "ND" },
      { label: "Ohio", value: "OH" },
      { label: "Oklahoma", value: "OK" },
      { label: "Oregon", value: "OR" },
      { label: "Pennsylvania", value: "PA" },
      { label: "Rhode Island", value: "RI" },
      { label: "South Carolina", value: "SC" },
      { label: "South Dakota", value: "SD" },
      { label: "Tennessee", value: "TN" },
      { label: "Texas", value: "TX" },
      { label: "Utah", value: "UT" },
      { label: "Vermont", value: "VT" },
      { label: "Virginia", value: "VA" },
      { label: "Washington", value: "WA" },
      { label: "West Virginia", value: "WV" },
      { label: "Wisconsin", value: "WI" },
      { label: "Wyoming", value: "WY" },
    ],
    Canada: [
      { label: "Alberta", value: "AB" },
      { label: "British Columbia", value: "BC" },
      { label: "Manitoba", value: "MB" },
      { label: "New Brunswick", value: "NB" },
      { label: "Newfoundland and Labrador", value: "NL" },
      { label: "Northwest Territories", value: "NT" },
      { label: "Nova Scotia", value: "NS" },
      { label: "Nunavut", value: "NU" },
      { label: "Ontario", value: "ON" },
      { label: "Prince Edward Island", value: "PE" },
      { label: "Quebec", value: "QC" },
      { label: "Saskatchewan", value: "SK" },
      { label: "Yukon", value: "YT" },
    ],
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
    email: Yup.string()
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Please enter a valid email",
      )
      .required("Please enter email"),
    city: Yup.string()
      .min(3, "City must be at least 3 characters")
      .required("Please enter city name"),
    postalCode: Yup.string()
      .min(3, "Postal Code must be at least 3 characters")
      .required("Please enter postal code"),
    dob: Yup.date()
      .required("Please select your date of birth")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "You must be 18 years or older",
      ),
    isSMS: Yup.boolean(),
    isAgreeToShareInformation: Yup.boolean()
      .required("Please accept to share personal health information")
      .oneOf([true], "Please accept to share personal health information"),
    isAcceptTermsAndCondition: Yup.boolean()
      .required("Please accept terms and conditions")
      .oneOf([true], "Please accept terms and conditions"),
    DigitalSignature: Yup.boolean()
      .required("Please accept terms and conditions")
      .oneOf([true], "Please accept terms and conditions"),
  });
  const disableBefore2006 = (current) => {
    return current && current.isAfter(dayjs(`${startYear}-01-01`));
  };
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
console.log(formValues)
  const handleDateChange = (date, dateString) => {
    setDob(dateString);
  };

  const handlePartnerDateChange = (date, dateString) => {
    setPartnerDob(dateString);
   
  };

  const handleGenderChange = (value) => {
    form.setFieldsValue({
      gender: value
    });
  };

  const handlePartnerGenderChange = (value) => {
    form.setFieldsValue({
      PartnerSex: value
    });
  };

  const disableUnder18Years = (current) => {
    return (
      current && current.isAfter(moment().subtract(18, "years").endOf("day"))
    );
  };
  const checkRequiredFields = (values) => {
    return requiredFields.every((field) => values[field]);
  };

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
    const allFormValues = { ...formValues, ...values };

    if (
      (usernameCheck && usernameCheck.statusCode !== "200") ||
      (emailCheck && emailCheck.statusCode !== "200")
    ) {
      message.error("Please input a valid email or username!");
      return;
    }

    try {
      setShowSpinner(true);

      setTimeout(() => {
        setEmailVerificationVisible(true);
      }, 1000);
      const processedValues = {
        ...allFormValues,
        country: selectedCountry.label,
        stateProvince: selectedState.label,
        isAssessor: false,
        ExistOnMira: false,
        height: parseFloat(allFormValues.Height) || 0,
        weight: parseFloat(allFormValues.Weight) || 0,
        MetricImperial: unit === "Metric",
        Pronouns: selectedPronoun?.value,
        Gender: "Female",
        PartnerSex: allFormValues.PartnerFirstName ? "Male" : undefined,
        PartnerPronouns: selectedPartnerPronoun?.value,
        dob: dob,
        PartnerDob: allFormValues.PartnerDob,
      };

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
      );
    } finally {
      setShowSpinner(false);
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

  useEffect(() => {
    handleUsernameBlur();
    handleEmailBlur();
  }, [values.userName, values.email, handleUsernameBlur, handleEmailBlur]);

  useEffect(() => {
    handleUsernameBlur();
    handleEmailBlur();
  }, [values?.userName, values?.email, handleUsernameBlur, handleEmailBlur]);

 
  const handleCloseModal = () => {
    setShowTermsConditionsModal(false);
  };
  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };
  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false);
  };
  const handleCloseCollectionNoticeModal = () => {
    setShowCollectionNoticeModal(false);
  };
  const customizeRequiredMark = (label, { required }) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );
  const [isModalVisible, setIsModalVisible] = useState(false);



  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSetUnit = (checked) => {
    setUnit(checked);
    setHeightOfPatient('')
    setWeightOfPatient('')
    form.resetFields(["Height", "Weight"]);
    form.validateFields(["Height", "Weight"]);
  };
  const nextStep = () => {
    form
      .validateFields()
      .then((values) => {
        setFormValues({ ...formValues, ...values });

        setCurrentStep(currentStep + 1);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <>
      <div className="">
        <div className="full-width-container">
          <Row gutter={24} style={{ height: "100vh" }}>
            <Col
              span={2}
              className="column-1"
              style={{ backgroundColor: "#EFD0BD" }}
            ></Col>
            <Col span={20} className="column-2">
              <div className="form-scrollable">
           
                <div className="col-xl-9 col-lg-10 col-md-12">
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
                    className="btn btn-primary btn-user btn-block"
                    style={{background:'#00ADEF', border:'none'}}
                  >
                    <span>Sign In</span>
                  </NavLink>
                </form>
              </nav>
                  <div className="card o-hidden border-0  my-3">
                    <div className="card-body p-5">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="">
                            <div>
                            {currentStep === 0 && <p
                                style={{
                                  fontSize: 20,
                                  fontWeight: 700,
                                  color: "#000",
                                  textAlign:'center'
                                }}
                              >
                                Personal Information    </p>}
                                {currentStep === 1 && <p
                                style={{
                                  fontSize: 20,
                                  fontWeight: 700,
                                  color: "#000",                                  textAlign:'center'

                                }}
                              >
                                Partner Information (Optional)
                              </p>}
                              
                              {currentStep === 2 && <p
                                style={{
                                  fontSize: 20,
                                  fontWeight: 700,
                                  color: "#000",                                  textAlign:'center'

                                }}
                              >
                                Agreements
                              </p>}
                            </div>
                            <div
  style={{
    display: "flex",
    gap: "10px",
    alignItems: "center",
    width: "200px",
    margin: "0 auto", 
  }}
>
  <div
    style={{
      height: "2px",
      backgroundColor: currentStep === 0 ? "#01ACEE" : "gray",
      flex: 1,
    }}
  ></div>

  <div
    style={{
      height: "2px",
      backgroundColor: currentStep === 1 ? "#01ACEE" : "gray",
      flex: 1,
    }}
  ></div>

  <div
    style={{
      height: "2px",
      backgroundColor: currentStep === 2 ? "#01ACEE" : "gray",
      flex: 1,
    }}
  ></div>
</div>


                            <Form
                              layout="vertical"
                              form={form}
                              onFinish={handleFinish}
                              requiredMark={customizeRequiredMark}
                              initialValues={values}
                              autoComplete="off"
                              onValuesChange={(changedValues, allValues) => {
                                setButtonDisabled(
                                  !checkRequiredFields(allValues),
                                );
                              }}
                            >
                              <Steps
                                current={currentStep}
                                style={{ marginTop: 10, height: 30 }}
                                direction={"horizontal"}

                              >
                              </Steps>

                              <FormItem
                                name="role"
                                initialValue={values.role}
                                rhidden
                              >
                                <Input type="hidden" value={"4"} />
                              </FormItem>
                              {currentStep === 0 && (
                                <>
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
                                        <Input placeholder="Enter Last Name" />
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12 col-sm-12">
                                      <Form.Item
                                        label="Preferred Name (If different from legal name)"
                                        name="preferredName"
                                      >
                                        <Input placeholder="Enter Preferred Name" />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="row mb-2">
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
                                                  usernameCheck.statusCode ===
                                                    "200"
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
                                  <div className="row">
                                    <div className="col-lg-3 col-sm-3">
                                      <FormItem label="Sex" name="gender" rules={[
                                        {
                                          required: true,
                                          message:
                                            "! Please enter your Sex",
                                        },
                                      ]}>
                                        <Select
                                          onChange={handleGenderChange}
                                          options={[
                                            { label: "Male", value: "male" },
                                            {
                                              label: "Female",
                                              value: "female",
                                            },
                                          ]}
                                        />
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-9 col-sm-9">
                                      <FormItem
                                        label="Pronouns"
                                        name="Pronouns"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your preferred pronouns",
                                          },
                                        ]}
                                      >
                                        <Select
                                          options={pronouns}
                                          onChange={(selectedOption) => {
                                            setSelectedPronoun(selectedOption);
                                            form.setFieldsValue({
                                              pronouns: selectedOption,
                                            });
                                          }}
                                          value={pronouns.find(
                                            (option) =>
                                              option.value ===
                                              selectedPronoun?.value,
                                          )}
                                        />
                                      </FormItem>
                                    </div>
                                  </div>

                                  <div className="row">
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
                                          onFocus={() =>
                                            setPasswordFocused(true)
                                          }
                                        />
                                      </FormItem>
                                    </div>
                                  </div>

                                  {passwordFocused && (
                                    <Card>
                                      <div>Password must contain:</div>
                                      <div
                                        style={{
                                          color: passwordValidations.minLength
                                            ? "green"
                                            : "red",
                                        }}
                                      >
                                        {passwordValidations.minLength
                                          ? "✓"
                                          : "✗"}{" "}
                                        8 characters minimum
                                      </div>
                                      <div
                                        style={{
                                          color: passwordValidations.lowercase
                                            ? "green"
                                            : "red",
                                        }}
                                      >
                                        {passwordValidations.lowercase
                                          ? "✓"
                                          : "✗"}{" "}
                                        One lowercase character
                                      </div>
                                      <div
                                        style={{
                                          color: passwordValidations.uppercase
                                            ? "green"
                                            : "red",
                                        }}
                                      >
                                        {passwordValidations.uppercase
                                          ? "✓"
                                          : "✗"}{" "}
                                        One uppercase character
                                      </div>
                                      <div
                                        style={{
                                          color: passwordValidations.number
                                            ? "green"
                                            : "red",
                                        }}
                                      >
                                        {passwordValidations.number ? "✓" : "✗"}{" "}
                                        One number
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
                                        <Input.Password
                                          value={confirmPassword}
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-lg-6 col-sm-12">
                                      <Form.Item
                                        label="Email"
                                        name="email"
                                        help={
                                          emailCheck && (
                                            <div
                                              style={{
                                                color:
                                                  emailCheck.statusCode ===
                                                    "200"
                                                    ? "green"
                                                    : "red",
                                                fontSize: "12px",
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
                                    <div className="col-lg-6 col-sm-12">
                                      <FormItem
                                        label="Uli Number"
                                        name="uli"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your ULI Number",
                                          },
                                        ]}
                                      >
                                        <Input placeholder="000000" />
                                      </FormItem>
                                    </div>
                                    </div>
                                    <div className="row">

                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        label="Address"
                                        name="address"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your Address",
                                          },
                                        ]}
                                      >
                                        <Input placeholder="Enter Address" />
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        label="Apartment, Suite, etc"
                                        name="appartmentOrSuite"

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
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your country",
                                          },
                                        ]}
                                      >
                                        <Select
                                          options={countries}
                                          value={countries.find(
                                            (option) =>
                                              option.value ===
                                              selectedCountry?.value,
                                          )}
                                          onChange={(selectedOption) => {
                                            setSelectedCountry(selectedOption);
                                            form.setFieldsValue({
                                              country: selectedOption,
                                            });
                                            setSelectedState(null);
                                            form.setFieldsValue({
                                              stateProvince: null,
                                            });
                                          }}
                                        />
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                      <FormItem
                                        label="State/Province"
                                        name="stateProvince"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your state",
                                          },
                                        ]}
                                      >
                                        <Select
                                          options={
                                            states[selectedCountry?.value]
                                          }
                                          value={states[
                                            selectedCountry?.value
                                          ]?.find(
                                            (option) =>
                                              option.value ===
                                              selectedState?.value,
                                          )}
                                          onChange={(selectedOption) => {
                                            setSelectedState(selectedOption);
                                            form.setFieldsValue({
                                              stateProvince: selectedOption,
                                            });
                                          }}
                                          isDisabled={!selectedCountry}
                                        />
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                      <Form.Item
                                        label="City"
                                        name="city"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please enter your city",
                                          },
                                        ]}
                                      >
                                        <Input
                                          placeholder="Enter City"
                                          onChange={handleChange("city")}
                                        />
                                      </Form.Item>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                      <FormItem
                                        label="Postal Code"
                                        name="postalCode"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your Postal Code",
                                          },
                                        ]}
                                      >
                                        <Input maxLength={6} placeholder="Enter Postal Code" />
                                      </FormItem>
                                    </div>
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

                                  <div className="row">
                                    <div className="col-lg-12 col-sm-12">
                                      <Form.Item
                                        label="Date of Birth"
                                        name="dob"
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter date of birth",
                                          },
                                        ]}
                                      >
                                        <DatePicker
                                          disabledDate={disableBefore2006}
                                          defaultPickerValue={dayjs(`${startYear}-01-01`)}
                                          style={{
                                            width: "100%",
                                            height: "42px",
                                            borderColor: "#000",
                                          }}
                                          onChange={handleDateChange}
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-4 col-sm-4">
                                      <div
                                        style={{
                                          background: "#C2E6F8",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "space-between",
                                          padding: 10,
                                          color: "#000",
                                          marginBottom: 30,
                                          borderRadius: 10,
                                          fontSize: "15px",
                                        }}
                                      >
                                        <Radio.Group
                                          value={unit}
                                          onChange={(e) => handleSetUnit(e.target.value)}
                                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}
                                        >
                                          <Radio value="Metric" style={{ margin: "0 10px" }}>Metric</Radio>
                                          <Radio value="Imperial" style={{ margin: "0 10px" }}>Imperial</Radio>
                                        </Radio.Group>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                      <Form.Item
                                        name="Height"
                                        label=""
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter your height",
                                          },
                                          {
                                            validator: (_, value) => {
                                              
                                              const isValid = 
                                                unit === "Metric"
                                                  ? value >= 50 && value <= 250
                                                  : feet >= 1 && feet <= 8 && inches >= 0 && inches <= 11;
                                              return isValid
                                                ? Promise.resolve()
                                                : Promise.reject(
                                                  `Height must be valid for ${unit}, ${unit === "Metric"
                                                    ? "between 50 cm and 250 cm"
                                                    : "between 1 ft and 8 ft, with inches between 0 and 11"
                                                  }`
                                                );
                                            },
                                          },
                                        ]}
                                      >
                                        {unit === "Metric" ? (
                                          <div style={{ display: "flex", alignItems: "center" }}>
                                            <Input
                                              type="number"
                                              className="input_questionnaire"
                                              placeholder="Enter Height"
                                              value={heightOfPatient}
                                              min={0}
                                              onChange={(e) => setHeightOfPatient(e.target.value)}
                                              style={{ marginRight: "10px" }}
                                            />
                                            <span>cm</span>
                                          </div>
                                        ) : (
                                          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                                            <Input
                                              type="number"
                                              className="input_questionnaire"
                                              placeholder="ft."
                                              value={feet}
                                              onChange={(e) => setFeet(e.target.value)}
                                              min={0}
                                             
                                            />
                                            <span>ft</span>
                                            <Input
                                              type="number"
                                              className="input_questionnaire"
                                              placeholder="in."
                                              value={inches}
                                              min={0}
                                              onChange={(e) => setInches(e.target.value)}
                                           
                                            />
                                            <span>in</span>
                                          </div>
                                        )}
                                      </Form.Item>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                      <Form.Item
                                        label=""
                                        name="Weight"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter your weight",
                                          },
                                          {
                                            validator: (_, value) => {
                                            
                                              const isValid = unit === "Metric"
                                                ? value >= 10 && value <= 500
                                                : value >= 10 && value <= 500;
                                              return isValid
                                                ? Promise.resolve()
                                                : Promise.reject(`Weight must be valid for ${unit}`);
                                            },
                                          },
                                        ]}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <Input
                                            type="number"
                                            className="input_questionnaire"
                                            placeholder="Enter Weight"
                                            value={weightOfPatient}
                                            onChange={(e) => setWeightOfPatient(e.target.value)}
                                            style={{ marginRight: "10px" }}
                                            min={0}
                                          />
                                          <span>
                                            {unit === "Metric" ? "kg" : "lbs"}
                                          </span>
                                        </div>
                                      </Form.Item>
                                    </div>
                                  </div>
                                </>
                              )}
                              {currentStep === 1 && (
                                <>
                                  <div className="row">
                                    <div className="col-lg-6 col-sm-12">
                                      <FormItem
                                        label="First Name"
                                        name="PartnerFirstName"
                                      >
                                        <Input placeholder="Enter First Name" />
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-6 col-sm-12">
                                      <FormItem
                                        label="Last Name"
                                        name="PartnerLastName"
                                      >
                                        <Input placeholder="Enter Last Name" />
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem label="Sex" name="PartnerSex">
                                        <Select
                                          onChange={handlePartnerGenderChange}
                                          options={[
                                            { label: "Male", value: "male" },
                                            {
                                              label: "Female",
                                              value: "female",
                                            },
                                          ]}
                                        />
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row ">
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        label="Pronouns"
                                        name="PartnerPronouns"
                                      >
                                        <Select
                                          options={pronouns}
                                          onChange={(selectedOption) => {
                                            setSelectedPartnerPronoun(
                                              selectedOption,
                                            );
                                            form.setFieldsValue({
                                              PartnerPronouns: selectedOption.value,
                                            });
                                          }}
                                          value={pronouns.find(
                                            (option) =>
                                              option.value ===
                                              selectedPartnerPronoun?.value,
                                          )}
                                        />
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12 col-sm-12">
                                      <Form.Item
                                        label="Date of Birth"
                                        name="PartnerDob"
                                      >
                                        <DatePicker
                                          defaultPickerValue={dayjs(`${startYear}-01-01`)}
                                          format="YYYY-MM-DD"
                                          style={{
                                            width: "100%",
                                            height: "42px",
                                            borderColor: "#000",
                                          }}
                                          onChange={handlePartnerDateChange}
                                          disabledDate={disableUnder18Years}
                                        />
                                      </Form.Item>
                                    </div>
                                  </div>
                                </>
                              )}
                              {currentStep === 2 && (
                                <>
                                  <p
                                    style={{
                                      color: "#335CAD",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {" "}
                                    Authorization for Email Communication
                                  </p>
                                  <div className="row">
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="isSMS"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I authorize My Fertility Labs to send
                                          text messages to the phone number I
                                          provided
                                        </Checkbox>
                                      </FormItem>
                                    </div>
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="isSendResultToEmail"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I authorize My Fertility Labs Inc. to
                                          send my test results to the email
                                          address I have provided. I acknowledge
                                          that email is not a secure
                                          communication method. I verify that
                                          the provided email address is correct
                                          and accurately recorded. If the email
                                          address is not mine, I permit the
                                          owner of the provided email address to
                                          receive my test results on my behalf 
                                        </Checkbox>
                                      </FormItem>
                                    </div>

                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="isAgreeToShareInformation"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I agree to allow my personal health
                                          information to be shared with My
                                          Fertility Labs healthcare providers
                                          and authorize the use of anonymized
                                          data for research and development
                                          purposes, aimed at enhancing services
                                          for all users 
                                        </Checkbox>
                                      </FormItem>
                                    </div>

                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="IAgreeToReceiveInformation"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I agree to receive both online and
                                          in-person care and authorize the
                                          sharing of this information with
                                          healthcare personnel, including
                                          clinician, fertility coach, or other
                                          healthcare support, solely for the
                                          purpose of providing care to the
                                          individual or couple
                                        </Checkbox>
                                      </FormItem>
                                    </div>
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
                                          I have read and accept the terms of
                                          the
                                         
                                          <span
                                            className="text-primary"
                                            onClick={() => window.open('/terms-of-service', '_blank')}
                                            style={{ cursor: 'pointer' }}
                                          >
                                            {" "}
                                            Terms of Services
                                          </span>
                                          , and
                                          <span
                                            className="text-primary"
                                            onClick={() => window.open('/privacy-policy', '_blank')}
                                            style={{ cursor: 'pointer' }}
                                          >
                                            {" "}
                                            Privacy Policy
                                          </span>
                                          , and
                                          <span
                                            className="text-primary"
                                            onClick={() => window.open('/collection-notice', '_blank')}
                                            style={{ cursor: 'pointer' }}
                                          >
                                            {" "}
                                            Collection Notice
                                          </span>
                                        </Checkbox>
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row" style={{display:'none'}}>
                                    <p
                                      style={{
                                        color: "#335CAD",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {" "}
                                      Consent to Use Anonymized Data{" "}
                                      <span style={{ fontWeight: "400" }}>
                                        <i>(Optional)</i>
                                      </span>
                                    </p>
                                    <div className="col-lg-12 col-sm-12" style={{display:'none'}}>
                                      <FormItem
                                        name="AgreeToUseData"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I consent to the use of my anonymized
                                          health data for clinical research,
                                          internal research, and AI development
                                          aimed at improving reproductive
                                          healthcare outcomes. I understand that
                                          this data will be used in a manner
                                          that does not identify me personally
                                          and that I can withdraw this consent
                                          at any time
                                        </Checkbox>
                                      </FormItem>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <p
                                      style={{
                                        color: "#335CAD",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Digital Signature:
                                    </p>
                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="DigitalSignature"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          By signing below, I acknowledge that I
                                          have read and understand the consent
                                          provided above
                                        </Checkbox>
                                      </FormItem>
                                    </div>

                                    <Form.Item
                                      name="DigitalSignatureName"
                                      rules={[
                                        {
                                          required: true,
                                          message: "! Please confirm",
                                        },
                                      ]}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        <p className="mr-2">
                                          Type Your Name as a Signature:
                                        </p>
                                        <Input
                                          style={{
                                            border: "none",
                                            borderBottom: "1px solid #d9d9d9",
                                            boxShadow: "none",
                                            width: "300px",
                                            marginTop: -40,
                                          }}
                                          placeholder=""
                                        />
                                      </div>
                                    </Form.Item>
                                  </div>
                                  <div
                                    className="text-center"
                                    style={{ display: "none" }}
                                  >
                                    <a className="small" href="/">
                                      Already have an account? Sign In
                                    </a>
                                  </div>
                                </>
                              )}
                              <div className="steps-action">
                                {currentStep < 2 && (
                                  <Button
                                    type="primary"
                                    style={{
                                      width: isMobile?"":"200px",
                                      height: "46.42px",
                                      borderRadius: 10,
                                      backgroundColor: "rgb(1, 173, 240)",
                                      float: "right",
                                    }}
                                    onClick={() => nextStep()}
                                  >
                                    Continue
                                  </Button>
                                )}
                                {currentStep === 2 && (
                                  <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={buttonDisabled}
                                    style={{
                                      width: isMobile?"":"200px",
                                      height: "46.42px",
                                      backgroundColor: "rgb(1, 173, 240)",
                                      float: "right",
                                    }}
                                  >
                                    {showSpinner && <Spin size="small" />} Done
                                  </Button>
                                )}
                                {currentStep >= 1 && (
                                  <Button
                                    style={{
                                      width: isMobile?"":"200px",
                                      height: "46.42px",
                                    }}
                                    onClick={() => prevStep()}
                                  >
                                    Previous
                                  </Button>
                                )}
                              </div>
                            </Form>
                            <EmailVerificationModal
                              visible={emailVerificationVisible}
                              onCancel={handleEmailVerificationCancel}
                              onVerify={handleEmailVerificationVerify}
                              email={values.email}
                            />
                            <Modal
                              title="Email Information"
                              visible={isModalVisible}
                              onOk={handleOk}
                              onCancel={handleCancel}
                              footer={[
                                <Button key="back" onClick={handleCancel}>
                                  No, thank you
                                </Button>,
                                <Button
                                  key="submit"
                                  type="primary"
                                  onClick={handleOk}
                                >
                                  Yes Please!
                                </Button>,
                              ]}
                            >
                              <p>
                                Would you like us to create an account for you on Mira using the same email you plan to use for MFL?
                              </p>
                            </Modal>
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
              style={{ backgroundColor: "#EFD0BD" }}
            ></Col>
          </Row>
        </div>
      </div>

      <CustomModal
        show={showTermsConditionsModal}
        onHide={handleCloseModal}
        size="lg"
        title={"Consent & Agreement"}
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
      <CustomModal
        show={showTermsModal}
        onHide={handleCloseTermsModal}
        size="lg"
        title={"Terms of Services"}
        body={
          <>
            <Row>
              <div className="d-flex flex-column col-md-8 offset-md-2 col-sm-12 mt-2 text-black">
                <div className="mb-3">
                  <h4>My Fertility Labs Terms of Service</h4>
                  <p><strong>Effective Date: August 16, 2024</strong></p>
                  
                  <h5>Introduction</h5>
                  <p>Welcome to My Fertility Labs, Inc. ("My Fertility Labs," "we," "our," or "us"). These Terms of Service ("Terms") govern your use of our services including our platform, websites, and mobile applications ("Services"). By accessing or using our Services, you agree to these Terms. If you do not agree to these Terms, please do not use our Services.</p>

                  <h5>1. Use of the Services</h5>
                  <h6>1.1 Eligibility</h6>
                  <p>You must be at least 18 years old to use our Services. By using the Services, you confirm that you meet this age requirement.</p>

                  <h6>1.2 Account Registration</h6>
                  <p>To access certain features, you may need to create an account. You agree to provide accurate information and maintain the confidentiality of your credentials. You are responsible for all activities under your account.</p>

                  <h6>1.3 Delete Account</h6>
                  <p>You may delete your account at any time in your account settings. After pressing "Delete" you will need to confirm you want to delete your account. You will be notified that your account will be put into cold storage records and your account will be deleted. Once confirming, you will no longer have access to your account. Your data will be retained for 1 month and then you will receive a warning email a few days before it would move into cold storage asking if they are sure they want to delete their account and mention health data will move into cold storage following regulatory guidelines for the jurisdiction.</p>
                  <p>You may request that My Fertility Labs confidentially delete your information by contacting My Fertility Labs at privacy@myfertilitylabs.com. My Fertility Labs will delete your information unless we are required by law to retain the information. For more information also see My Fertility Labs Privacy Policy.</p>

                  <h5>2. Privacy</h5>
                  <p>Our use of your data, including health-related information, is governed by our Privacy Policy. By using the Services, you consent to our data practices as described in that Policy.</p>

                  <h5>3. Health-Related Services</h5>
                  <h6>3.1 Role of My Fertility Labs</h6>
                  <p>My Fertility Labs is a platform that connects patients with independent healthcare providers, including doctors, nurse practitioners, pharmacists, nutritionists, and fertility support practitioners. My Fertility Labs itself does not provide medical advice, diagnosis, or treatment. Instead, it facilitates the telehealth connection between patients and healthcare providers.</p>

                  <h6>3.2 Services Provided by Healthcare Providers</h6>
                  <p>Healthcare providers on our platform offer telehealth services, including diagnosis, treatment, and support within their professional scope and judgment. Providers include:</p>
                  <ul>
                    <li>Doctors and Nurse Practitioners: Diagnosing and treating medical conditions.</li>
                    <li>Pharmacists: Collaborating with physicians and other healthcare providers to provide care within their scope.</li>
                    <li>Nutritionists and Nutritional Practitioners: Offering dietary and supplement recommendations.</li>
                    <li>Fertility Support Practitioners and Fertility Educators: Providing education and emotional support.</li>
                  </ul>

                  <h6>3.3 Patient Responsibilities</h6>
                  <p>Patients should maintain regular checkups with their family physician and collaborate on any treatment plans initiated through My Fertility Labs. Our platform is designed to complement your ongoing healthcare, not replace it.</p>

                  <h6>3.4 Liability and Limitations</h6>
                  <p>My Fertility Labs does not control healthcare providers' clinical decisions. All medical advice and treatment are the sole responsibility of the individual providers. My Fertility Labs is not liable for any medical decisions or actions taken by these providers.</p>

                  <h6>3.5 Use of Anonymized Data for Research and AI</h6>
                  <p>By using our Services, you consent to the use of your anonymized health data for clinical and internal research, clinician training, product development, and AI innovation aimed at enhancing healthcare services. This data is used exclusively to advance reproductive health research and improve patient outcomes. All data used in this manner will be anonymized to ensure it cannot be linked back to you personally.</p>

                  <h5>4. User Conduct</h5>
                  <h6>4.1 Prohibited Conduct</h6>
                  <p>You agree not to:</p>
                  <ul>
                    <li>Engage in unlawful activities.</li>
                    <li>Infringe upon intellectual property rights.</li>
                    <li>Transmit harmful software.</li>
                    <li>Falsify health data or share prescription information with unauthorized persons.</li>
                    <li>Interfere with the Services' operation or networks.</li>
                  </ul>

                  <h5>5. Intellectual Property</h5>
                  <h6>5.1 Ownership</h6>
                  <p>All content, features, and functionality within the Services, including but not limited to software, text, graphics, logos, icons, audio, video, and the design, selection processes, patient flow, care plans, support tools, algorithms, artificial intelligence, and the arrangement and presentation of these elements, are owned by My Fertility Labs and are protected by intellectual property laws.</p>

                  <h6>5.2 Restrictions</h6>
                  <p>Except as expressly authorized in writing by My Fertility Labs, you may not:</p>
                  <ul>
                    <li>Copy, reproduce, republish, upload, post, transmit, distribute, modify, or create derivative works of the Services or any content therein;</li>
                    <li>Use any trademarks, logos, or service marks displayed on the Services;</li>
                    <li>Disassemble, decompile, reverse engineer, or otherwise attempt to derive source code from any software on the Services;</li>
                    <li>Use the Services or any content for commercial purposes without a license.</li>
                  </ul>

                  <h5>6. Limitation of Liability</h5>
                  <p>To the fullest extent permitted by law, My Fertility Labs is not liable for indirect, incidental, special, or consequential damages arising from your use of the Services.</p>

                  <h5>7. Dispute Resolution</h5>
                  <h6>7.1 Arbitration Agreement</h6>
                  <p>You and My Fertility Labs agree to resolve disputes through binding arbitration in Edmonton, Alberta, Canada, under the Alberta Arbitration Act.</p>

                  <h6>7.2 Class Action Waiver</h6>
                  <p>Dispute resolution will be conducted on an individual basis, not as a class action.</p>

                  <h5>8. Changes to the Terms</h5>
                  <p>We may update these Terms occasionally. When we do, we will update the "Effective Date" at the top of this page. Continued use of the Services after changes implies acceptance of the new Terms.</p>

                  <h5>9. Termination</h5>
                  <p>We may terminate or suspend your access to the Services at any time, particularly in cases of violation of these Terms, illegal activity, or failure to comply with applicable laws. In most cases, we will provide reasonable notice before termination, except where immediate termination is necessary to comply with legal obligations or to protect the integrity of the Services. Upon termination, your rights under these Terms will cease immediately.</p>

                  <h5>10. Governing Law</h5>
                  <p>These Terms are governed by the laws of Alberta, Canada, without regard to conflict of laws principles.</p>

                  <h5>11. Contact Us</h5>
                  <p>For questions about these Terms, contact us at:</p>
                  <p>My Fertility Labs, Inc., PO Box 423 STN Main,<br/>
                  St. Albert, Alberta, T8N 7A2<br/>
                  Email: privacy@myfertilitylabs.com</p>

                  <p className="text-center mt-4">© 2025 My Fertility Labs Inc. All rights reserved.</p>
                </div>
              </div>
            </Row>
          </>
        }
        footer={
          <>
            <button
              className="btn btn-secondary mr-2"
              type="button"
              onClick={handleCloseTermsModal}
            >
              Close
            </button>
          </>
        }
      />
      <CustomModal
        show={showShowPrivacyModal}
        onHide={handleClosePrivacyModal}
        size="lg"
        title={"Privacy Policy"}
        body={
          <>
            <Row>
              <div className="d-flex flex-column col-md-8 offset-md-2 col-sm-12 mt-2 text-black">
                <center className="mb-3">
                  <p className="font-weight-bold">Collection Notice</p>
                  <p>
                    Notice of Collection of Health Information<br/>
                    My Fertility Labs (MFL) is committed to protecting your personal health information. We collect,
                    use, and disclose your health information to provide you with fertility care services and comply
                    with legal obligations.
                  </p>
                  <p>
                    Patients have the right to access and correct their health information. For more information on
                    your privacy rights, contact the Privacy Officer, at privacy@myfertilitylabs.com, or refer to our
                    Privacy Policy.
                  </p>
                  <p>
                    Patients may withdraw or limit consent for specific uses of their health information by
                    contacting the Privacy Officer, at privacy@myfertilitylabs.com, subject to legal and regulatory
                    obligations.
                  </p>
                  <p className="font-weight-bold">Why We Collect Your Information:</p>
                  <ul style={{ textAlign: 'left' }}>
                    <li>To provide diagnostics, treatment plans, and related health services.</li>
                    <li>Provide telehealth services, care related to general and reproductive health, and
                    personalized treatment plans.</li>
                    <li>To facilitate communication, billing, and scheduling.</li>
                    <li>To comply with legal and regulatory requirements.</li>
                  </ul>
                  <p className="font-weight-bold">Legal Authority for Collection:</p>
                  <ul style={{ textAlign: 'left' }}>
                    <li>Health Information Act, Section 20(b): Collection for the provision of health services.</li>
                    <li>Health Information Act, Section 21(1)(a): Collection authorized for diagnostic and
                    treatment purposes.</li>
                  </ul>
                  <p className="font-weight-bold">Questions? Contact Us:</p>
                  <p>
                    If you have any questions about the collection of your health information, please contact:<br/>
                    Privacy Officer, privacy@myfertilitylabs.com
                  </p>
                  <p>
                    By proceeding with your registration, you confirm that you have read and understood this
                    notice.
                  </p>
                  <hr/>
                  <p className="font-weight-bold">Privacy Policy</p>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
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
              onClick={handleClosePrivacyModal}
            >
              Close
            </button>
          </>
        }
      />
      <CustomModal
        show={showCollectionNoticeModal}
        onHide={handleCloseCollectionNoticeModal}
        size="lg"
        title={"Collection Notice"}
        body={
          <>
            <Row>
              <div className="d-flex flex-column col-md-8 offset-md-2 col-sm-12 mt-2 text-black">
                <center className="mb-3">
                  <p className="font-weight-bold">Notice of Collection of Health Information</p>
                  <p>
                    My Fertility Labs (MFL) is committed to protecting your personal health information. We collect,
                    use, and disclose your health information to provide you with fertility care services and comply
                    with legal obligations.
                  </p>
                  <p>
                    Patients have the right to access and correct their health information. For more information on
                    your privacy rights, contact the Privacy Officer, at privacy@myfertilitylabs.com, or refer to our
                    Privacy Policy.
                  </p>
                  <p>
                    Patients may withdraw or limit consent for specific uses of their health information by
                    contacting the Privacy Officer, at privacy@myfertilitylabs.com, subject to legal and regulatory
                    obligations.
                  </p>
                  <p className="font-weight-bold">Why We Collect Your Information:</p>
                  <ul style={{ textAlign: 'left' }}>
                    <li>To provide diagnostics, treatment plans, and related health services.</li>
                    <li>Provide telehealth services, care related to general and reproductive health, and
                    personalized treatment plans.</li>
                    <li>To facilitate communication, billing, and scheduling.</li>
                    <li>To comply with legal and regulatory requirements.</li>
                  </ul>
                  <p className="font-weight-bold">Legal Authority for Collection:</p>
                  <ul style={{ textAlign: 'left' }}>
                    <li>Health Information Act, Section 20(b): Collection for the provision of health services.</li>
                    <li>Health Information Act, Section 21(1)(a): Collection authorized for diagnostic and
                    treatment purposes.</li>
                  </ul>
                  <p className="font-weight-bold">Questions? Contact Us:</p>
                  <p>
                    If you have any questions about the collection of your health information, please contact:<br/>
                    Privacy Officer, privacy@myfertilitylabs.com
                  </p>
                  <p>
                    By proceeding with your registration, you confirm that you have read and understood this
                    notice.
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
              onClick={handleCloseCollectionNoticeModal}
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
