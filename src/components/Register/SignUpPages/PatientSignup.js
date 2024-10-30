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
import { Row, Col, Card, message, Radio, Modal, Switch } from "antd";
import "./SignupPages.css";
import { Form, Input, Button, Checkbox, DatePicker, Spin, Steps } from "antd";
import Select from "react-select";
import EmailVerificationModal from "./OTPModal";
import ReactInputMask from "react-input-mask";
import moment from "moment/moment";
import dayjs from 'dayjs';

const PatientSignup = () => {

  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] =
    useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showShowPrivacyModal, setShowPrivacyModal] = useState(false);
  const [form] = Form.useForm();
  const { Item: FormItem } = Form;
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  let confirmPassword = "";
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
  const initialValues = {
    role: "4",
    userName: "",
    firstName: "",
    lastName: "",
    PreferredName: "",
    Pronouns: "",
    gender: "Female",
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
    MetricImperial: false,
    isSMS: false,
    isSendResultToEmail: false,
    isAgreeToShareInformation: false,
    IAgreeToReceiveInformation: false,
    isAcceptTermsAndCondition: false,
    AgreeToUseData: false,
    DigitalSignature: "",
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
  const [currentStep, setCurrentStep] = useState(0);
  const { Step } = Steps;
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

  const handleDateChange = (date, dateString) => {
    console.log("Selected date:", date); // This should be a moment object
    console.log("Date string:", dateString); // This should be a formatted string

    setDob(dateString);
  };

  const disableUnder18Years = (current) => {
    return (
      current && current.isAfter(moment().subtract(18, "years").endOf("day"))
    );
  };
  const checkRequiredFields = (values) => {
    return requiredFields.every((field) => values[field]);
  };
  console.log(formValues);

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
    // Merge current form values with the ones accumulated in the state
    const allFormValues = { ...formValues, ...values };

    // Check username and email validation statuses
    if (
      (usernameCheck && usernameCheck.statusCode !== "200") ||
      (emailCheck && emailCheck.statusCode !== "200")
    ) {
      message.error("Please input a valid email or username!");
      return;
    }

    try {
      setShowSpinner(true); // Show spinner during async operation

      setTimeout(() => {
        setEmailVerificationVisible(true);
      }, 1000);
console.log(allFormValues)
      // Prepare processed values for submission
      const processedValues = {
        ...allFormValues,
        country: selectedCountry.label,
        stateProvince: selectedState.label,
        isAssessor: false,
        ExistOnMira: false,
        height: parseFloat(allFormValues.Height) || 0, // Ensure height is a number
        weight: parseFloat(allFormValues.Weight) || 0,
        MetricImperial: unit === "Metric",
        Pronouns: selectedPronoun?.value,
        Gender: "Male",
        PartnerSex: "Female",
        PartnerPronouns: selectedPartnerPronoun?.value,
        dob: dob,
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
      setShowSpinner(false); // Hide spinner once async operation completes
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

  const handleShowConsentModal = () => {
    setShowTermsConditionsModal(true);
  };
  const handleShowTermsModal = () => {
    setShowTermsModal(true);
  };
  const handleShowPrivacyModal = () => {
    setShowPrivacyModal(true);
  };

  const handleCloseModal = () => {
    setShowTermsConditionsModal(false);
  };
  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
  };
  const handleClosePrivacyModal = () => {
    setShowPrivacyModal(false);
  };
  console.log(dob);
  const customizeRequiredMark = (label, { required }) => (
    <>
      {label}
      {required && <span style={{ color: "red" }}>*</span>}
    </>
  );
  //Mira Prompts
  const [radioValue, setRadioValue] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setRadioValue(value);

    // Show modal if 'No' is selected
    if (value === "No") {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleSetUnit = (checked) => {
    setUnit(checked ? "Metric" : "Imperial");
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
                  <div className="card o-hidden border-0  my-3">
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
                              Let's get started
                            </p>
                            <Form
                              layout="vertical"
                              form={form}
                              onFinish={handleFinish}
                              requiredMark={customizeRequiredMark}
                              initialValues={values}
                              autoComplete="off"
                              style={{ marginTop: -50 }}
                              onValuesChange={(changedValues, allValues) => {
                                setButtonDisabled(
                                  !checkRequiredFields(allValues),
                                );
                              }}
                            >
                              <Steps
                                current={currentStep}
                                style={{ marginTop: 100 }}
                              >
                                <Step title="Personal Information" />
                                <Step title="Partner Information (Optional)" />
                                <Step title="Agreements" />
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
                                      <FormItem label="Sex" name="gender">
                                        <Select
                                          onChange={(selectedOption) => {
                                            form.setFieldsValue({
                                              stateProvince:
                                                selectedOption.label,
                                            });
                                          }}
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
                                            console.log(selectedPronoun, "sel");
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
                                    <div className="col-lg-12 col-sm-12">
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

                                    <div
                                      style={{
                                        color: "#335CAD",
                                        borderRadius: 10,
                                        marginBottom: 10,
                                        marginTop: 15,
                                      }}
                                    >
                                      Is this email same as that of MIRA
                                    </div>

                                    <div>
                                      <Radio.Group
                                        onChange={handleRadioChange}
                                        name="ExistOnMira"
                                        value={radioValue}
                                      >
                                        <Radio value="Yes">Yes</Radio>
                                        <Radio defaultChecked value="No">
                                          No
                                        </Radio>
                                      </Radio.Group>
                                    </div>

                                    <div className="col-lg-12 col-sm-12">
                                      <FormItem
                                        name="isAgreeToReceiveJaneApp"
                                        valuePropName="checked"
                                        rules={[
                                          {
                                            required: true,
                                            message: "! Please confirm",
                                          },
                                        ]}
                                      >
                                        <Checkbox>
                                          I confirm that the email provided
                                          above matches the one I used for{" "}
                                          <span
                                            style={{
                                              color: "#02BFCC",
                                              fontWeight: "bold",
                                            }}
                                          >
                                            Jane App
                                          </span>
                                          <span style={{ color: "red" }}>
                                            *
                                          </span>
                                        </Checkbox>
                                      </FormItem>
                                    </div>

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
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              "! Please enter your Apartment number",
                                          },
                                        ]}
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
                                          )} // Display the selected country
                                          onChange={(selectedOption) => {
                                            setSelectedCountry(selectedOption); // Store the whole object (label and value)
                                            form.setFieldsValue({
                                              country: selectedOption,
                                            }); // Store the object in the form
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
                                          )} // Display the selected state
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
                                        <Input placeholder="Enter Postal Code" />
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
                                        <p
                                          style={{
                                            margin: 0,
                                            marginLeft: 10,
                                            fontSize: "15px",
                                          }}
                                        >
                                          Metric
                                        </p>
                                        <Switch
                                          checked={unit === "Metric"}
                                          onChange={(checked) =>
                                            handleSetUnit(checked)
                                          }
                                          checkedChildren=""
                                          unCheckedChildren=""
                                        />
                                        <p
                                          style={{
                                            margin: 0,
                                            marginRight: 10,
                                            fontSize: "15px",
                                          }}
                                        >
                                          Imperial
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col-lg-4 col-sm-4">
                                      <Form.Item
                                        label=""
                                        name="Height"
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter your height",
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
                                            placeholder="Enter Height"
                                            style={{ marginRight: "10px" }}
                                          />
                                          <span>
                                            {unit === "Metric" ? "cm" : "inches"}
                                          </span>
                                        </div>
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
                                            style={{ marginRight: "10px" }}
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
                                          onChange={(selectedOption) => {
                                            form.setFieldsValue({
                                              stateProvince:
                                                selectedOption.label,
                                            });
                                          }}
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
                                              partner_pronouns: selectedOption,
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
                                          format="DD-MM-YYYY"
                                          style={{
                                            width: "100%",
                                            height: "42px",
                                            borderColor: "#000",
                                          }}
                                          onChange={handleDateChange}
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
                                          receive my test results on my behalf *
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
                                          for all users *
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
                                            onClick={handleShowConsentModal}
                                          >
                                            {" "}
                                            Consent & Agreement
                                          </span>
                                          ,
                                          <span
                                            className="text-primary"
                                            onClick={handleShowTermsModal}
                                          >
                                            {" "}
                                            Terms of Services
                                          </span>
                                          , and
                                          <span
                                            className="text-primary"
                                            onClick={handleShowPrivacyModal}
                                          >
                                            {" "}
                                            Privacy Policy
                                          </span>
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
                                      {" "}
                                      Consent to Use Anonymized Data{" "}
                                      <span style={{ fontWeight: "400" }}>
                                        <i>(Optional)</i>
                                      </span>
                                    </p>
                                    <div className="col-lg-12 col-sm-12">
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

                                    <Form.Item>
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
                                      width: "200px",
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
                                      width: "200px",
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
                                      width: "200px",
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
                                  No, I dont like thier services
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
                                Please would you like us to create an account
                                for you on Mira with this email?.
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
              onClick={handleClosePrivacyModal}
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
