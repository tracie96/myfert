import { useState } from "react";
import "./Register.css";
import { NavLink, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import tickImage from "../../assets/images/auth/tickImage.png";
import crossImage from "../../assets/images/auth/crossImage.png";
import MultiStepProgressBar from "./StepFormSubscription/MultiStepProgressBar";
import PlanDetails from "./StepFormSubscription/PlanDetails";
// import PaymentDetails from "./StepFormSubscription/PaymentDetails";
import PaymentConfirmation from "./StepFormSubscription/PaymentConfirmation";
import { Button, Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import { Col, Row } from "react-bootstrap";
import CustomModal from "../global_component/CustomModal";
import {
  createCheckoutSession,
  logoutAction,
} from "../redux/AuthController";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

const SubscriptionPlan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  const [showSubscriptionPregModal, setShowSubscriptionPregModal] =
    useState(null);
  const [showSubscriptionFerModal, setShowSubscriptionFerModal] =
    useState(null);

  const [currentStep, setCurrentStep] = useState(1);

  const [checkOutPayload, setCheckOutPayload] = useState();
  const emptyCheckOutPayloadValue = () => {
    setCheckOutPayload(undefined);
  };

  const initialValues = {
    id: userAuth.id || "",
    firstName: userAuth.firstName || "",
    lastName: userAuth.lastName || "",

    selectedPlan: "",
    subscriptionAmount: "",
    planCheckBox: "Yes",

    paymentMethod: "Stripe", // e.g stripe
    cardNumber: "",
    cardHolderName: "",
    cardCVV: "",
    cardMonthYear: "",

    email: userAuth.email || "",
    phoneNumber: userAuth.phoneNumber || "",
    referenceNumber: "123456789",
    paymentReference: "xxx567xx19",
    subTotalAmount: "",

    priceId: "",
  };
  const validateSubscriptionPlan = Yup.object().shape({
    selectedPlan: Yup.string().required("Please choose a plan to proceed"),
    subscriptionAmount: Yup.string().required(
      "Subscription amount is required"
    ),
    // cardNumber: Yup.string().max(16).required("Must enter card number"),
    // phoneNumber: Yup.string()
    //   .min(8, "Phone Number must be at least 8 characters")
    //   .required("Must enter phone number"),
    // cardHolderName: Yup.string().required("Must enter name"),
    // cardCVV: Yup.string().max(4).required("Must enter card 'CVV'"),
    // cardMonthYear: Yup.string().required("Must select date"),
  });

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    // event.target.type === "radio" ? event.target.checked : event.target.value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const { values, handleBlur, handleSubmit, errors, setValues, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: validateSubscriptionPlan,
      handleChange: handleChange,
      onSubmit: async (values) => {
        setShowSpinner(true);
        const priceId = values.subscriptionAmount;
        const getResponse = await dispatch(createCheckoutSession(priceId));
        console.log("createCheckoutSessixon response : ", getResponse?.payload);
        if (
          getResponse?.payload &&
          getResponse?.payload.isPaymentAlreadyCompleted
        ) {
          navigate(
            `/subscription-plan-succeeded/${getResponse?.payload.paymentTimeTicks}`
          );
        }
        setCheckOutPayload(getResponse?.payload);
        // await dispatch(postSubscriptionPayment(values));
        setShowSpinner(false);
      },
    });

  // if payment completed don't show this page redirect patient to home
  if (userAuth && userAuth?.isPaymentComplete) {
    return <Navigate to="/home" />;
  }

  const nextStep = () => {
    // setCurrentStep((prevStep) => (prevStep >= 4 ? 3 : prevStep + 1));
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => (prevStep <= 1 ? 1 : prevStep - 1));
    // setCurrentStep((prevStep) => prevStep - 1);
  };

  // const renderButtons = () => (
  //   <>
  //     {currentStep !== 1 && (
  //       <Button color="secondary float-left" onClick={prevStep}>
  //         Previous
  //       </Button>
  //     )}
  //     {currentStep < 4 && (
  //       <Button color="primary float-right" onClick={nextStep}>
  //         Next
  //       </Button>
  //     )}
  //     {currentStep === 4 && <Button color="primary float-right">Submit</Button>}
  //   </>
  // );

  // const confirmSubscriptionButton = () => {
  //   setShowSpinner(true);
  // };

  //#region Modal show
  const handleShowModal = (checkSubscription) => {
    if (checkSubscription === 1) {
      setShowSubscriptionPregModal(true);
    } else {
      setShowSubscriptionFerModal(true);
    }
  };
  const handleCloseModal = () => {
    setShowSubscriptionPregModal(false);
    setShowSubscriptionFerModal(false);
  };
  const goToNextFormModal = () => {
    setShowSubscriptionPregModal(false);
    setShowSubscriptionFerModal(false);
    nextStep();
  };
  //#endregion

  return (
    <>
      <div className="bg-gradient-white">
        <div className="container">
          {/* navbar content div */}
          <div className="row">
            <div className="col-lg-12">
              <nav className="navbar mt-3">
                <img
                  className="float-left"
                  src={fertilityImage}
                  alt="loginImage"
                  style={{ width: "150px" }}
                />
                <form className="d-flex" role="search">
                  {/* <button className="btn btn-outline-success" type="submit">
                    Search
                  </button> */}
                  <NavLink
                    to="/"
                    className="btn btn-primary btn-user btn-block"
                    onClick={() => dispatch(logoutAction())}
                  >
                    <span>Logout</span>
                  </NavLink>
                </form>
              </nav>
            </div>
          </div>
          <Row className="my-5">
            <Col className="col-8 offset-2">
              <MultiStepProgressBar currentStep={currentStep} />
            </Col>
          </Row>
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="card o-hidden border-0">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-12 pt-md-3">
                      <div className="p-1">
                        <div className="row">
                          <div className="col-lg-12">
                            <form className="user" onSubmit={handleSubmit}>
                              {/* <div className="form-group row">
                                <div className="col-lg-10 offset-1 p-0 mb-2">
                                  <div className="col-3 mb-3">
                                    <h4 className="font-weight-bold">
                                      Confirmation
                                    </h4>
                                  </div>
                                  <div
                                    className="card"
                                    style={{ border: "solid transparent" }}
                                  >
                                    <div
                                      className="card-body"
                                      style={{
                                        backgroundColor: "#ebebeb",
                                        borderRadius: "20px",
                                      }}
                                    >
                                      <div className="row">
                                        <div className="col-md-8">
                                          <div className="form-group">
                                            <label className="h5 font-weight-bold">
                                              Summary
                                            </label>
                                          </div>
                                          <hr
                                            style={{
                                              border: "1px solid",
                                            }}
                                          />
                                          <div className="row">
                                            <div className="col-md-6">
                                              <label>Selected Plan</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>Plan A</label>
                                            </div>
                                            <div className="col-md-6">
                                              <label>Date Of Submission</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>Today</label>
                                            </div>
                                            <div className="col-md-6">
                                              <label>Email Address</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>@gmail.com</label>
                                            </div>
                                            <div className="col-md-6">
                                              <label>Phone Number</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>(123)4567890</label>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-md-4">
                                          <div className="form-group">
                                            <label className="h5 font-weight-bold">
                                              Billing Total
                                            </label>
                                          </div>
                                          <hr
                                            style={{
                                              border: "1px solid",
                                            }}
                                          />
                                          <div className="row">
                                            <div className="col-md-7">
                                              <label>Subtotal</label>
                                            </div>
                                            <div className="col-md-4">
                                              <label>121$</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="row mt-3">
                                        <div className="col-md-8">
                                          <div className="form-group">
                                            <label className="h5 font-weight-bold">
                                              Payment Detail
                                            </label>
                                          </div>
                                          <hr
                                            style={{
                                              border: "1px solid",
                                            }}
                                          />
                                          <div className="row">
                                            <div className="col-md-6">
                                              <label>Payment Method</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>Stripe</label>
                                            </div>
                                            <div className="col-md-6">
                                              <label>Reference Number</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>123456</label>
                                            </div>
                                            <div className="col-md-6">
                                              <label>Payment Method</label>
                                            </div>
                                            <div className="col-md-5">
                                              <label>xxxx1234</label>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row mt-3">
                                    <div className="col-3">
                                      <span
                                        className="btn btn-block btn-user text-white font-weight-bold bg-danger"
                                        onClick={prevStep}
                                      >
                                        Back
                                      </span>
                                    </div>
                                    <div className="col-9 text-end">
                                      <span
                                        className="btn btn-user text-white font-weight-bold"
                                        style={{ backgroundColor: "#01acee" }}
                                      >
                                        Confirm Enrollment
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div> */}

                              <PlanDetails
                                currentStep={currentStep}
                                handleShowModal={handleShowModal}
                                values={values}
                                setFieldValue={setFieldValue}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                errors={errors}
                              />
                              {/* <PaymentDetails
                                currentStep={currentStep}
                                prevStep={prevStep}
                                nextStep={nextStep}
                                values={values}
                                setFieldValue={setFieldValue}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                errors={errors}
                              /> */}
                              <PaymentConfirmation
                                currentStep={currentStep}
                                prevStep={prevStep}
                                values={values}
                                setFieldValue={setFieldValue}
                                handleBlur={handleBlur}
                                handleChange={handleChange}
                                errors={errors}
                                showSpinner={showSpinner}
                                checkOutPayload={checkOutPayload}
                                emptyCheckOutPayloadValue={
                                  emptyCheckOutPayloadValue
                                }
                              />
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        show={showSubscriptionPregModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-success text-white py-2"
        title={"ProSPr/Pregnancy"}
        body={
          <>
            <Row>
              <div className="d-flex flex-column col-md-6 col-sm-12 mt-2 text-black">
                <center className="mb-3">
                  <img
                    src={tickImage}
                    alt="imgCheck"
                    style={{ width: "120px" }}
                  />
                </center>
                <p className="font-weight-bold">
                  I have at least one of the indicators qualifying me for entry.
                </p>
                <p>Infertility</p>
                <p>Previous Pregnancy Loss</p>
                <p>Low progesterone level</p>
                <p>Previous preterm birth</p>
                <p>Previous Pregnancy-induced hypertension or pre-eclampsia</p>
              </div>
              <div className="d-flex flex-column col-md-6 col-sm-12 text-black">
                <center className="mb-3">
                  <img
                    src={crossImage}
                    alt="imgCheck"
                    style={{ width: "120px" }}
                  />
                </center>
                <p>
                  I don't have any of the indicators for entry but still want
                  monitoring
                </p>
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
            <Button
              color="success"
              value="500"
              onClick={() => {
                goToNextFormModal();
                setFieldValue("subscriptionAmount", "500");
              }}
            >
              Confirm
            </Button>
          </>
        }
      />

      <CustomModal
        show={showSubscriptionFerModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-success text-white py-2"
        title={"Fertility Screen"}
        body={
          <>
            <Row>
              <div className="col-md-12 col-sm-12 mt-2 text-black">
                <div className="d-flex flew-row mb-3">
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="fertilityScreenRadioYes"
                      value="Yes"
                      checked={values.planCheckBox === "Yes"}
                      onChange={handleChange("planCheckBox")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fertilityScreenRadioYes"
                    >
                      Yes
                    </label>
                  </div>
                  <div className="form-check mr-3">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="fertilityScreenRadioNo"
                      value="No"
                      checked={values.planCheckBox === "No"}
                      onChange={handleChange("planCheckBox")}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="fertilityScreenRadioNo"
                    >
                      No
                    </label>
                  </div>
                  <p>
                    Currently taking any hormonal medications (eg. birth
                    control, testosterone){" "}
                    <span className="text-danger">(required)</span>
                  </p>
                </div>
                <div className="col-md-8 offset-md-2 col-sm-12 mt-2 text-black">
                  <Card className="rounded-3">
                    <CardHeader
                      className="text-center text-white p-5 h4 rounded-bottom"
                      style={{ backgroundColor: "#078190" }}
                    >
                      {values.planCheckBox === "Yes"
                        ? "I'm currently using Hormones"
                        : "I'm NOT using Hormones"}
                    </CardHeader>
                    <CardBody className="p-5">
                      <Row>
                        <ul
                          className="card-style-ul"
                          style={{ listStyle: "none" }}
                        >
                          <li>
                            <span className="mr-3">
                              <i className="font-weight-bold bi bi-check-lg"></i>
                            </span>
                            Check your reproductive health
                          </li>
                        </ul>
                        <ul
                          className="card-style-ul"
                          style={{ listStyle: "none" }}
                        >
                          <li>
                            <span className="mr-3">
                              <i className="font-weight-bold bi bi-check-lg"></i>
                            </span>
                            Hormonal Testing
                          </li>
                        </ul>
                        <ul
                          className="card-style-ul"
                          style={{ listStyle: "none" }}
                        >
                          <li>
                            <span className="mr-3">
                              <i className="font-weight-bold bi bi-check-lg"></i>
                            </span>
                            Follow up with RRM Clinician for results
                          </li>
                        </ul>
                      </Row>
                      <Row>
                        <div className="col-10 offset-1 mt-4">
                          <span>
                            Click{" "}
                            <a href="https://www.myfertilitylabs.com/fertility-screening">
                              here
                            </a>{" "}
                            for more information
                          </span>
                        </div>
                      </Row>
                    </CardBody>
                    <CardFooter className="text-center border-0 mt-2 bg-white">
                      <button
                        className="btn btn-block btn-user text-white font-weight-bold"
                        style={{ backgroundColor: "#078190" }}
                        value="250"
                        onClick={() => {
                          goToNextFormModal();
                          setFieldValue("subscriptionAmount", "250");
                        }}
                      >
                        Day 3 Screen - $250
                      </button>
                      {values.planCheckBox === "No" && (
                        <>
                          <span
                            className="btn btn-block btn-user text-white font-weight-bold"
                            style={{ backgroundColor: "#078190" }}
                          >
                            Full Cycle Screen (Coming Soon)
                          </span>
                          <span
                            className="btn btn-block btn-user text-white font-weight-bold"
                            style={{ backgroundColor: "#078190" }}
                          >
                            Couple Screen (Coming Soon)
                          </span>
                        </>
                      )}
                    </CardFooter>
                  </Card>
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

export default SubscriptionPlan;
