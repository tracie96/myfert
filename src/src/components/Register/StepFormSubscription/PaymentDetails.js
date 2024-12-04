import React from "react";
import { Input } from "reactstrap";
import { Card, CardHeader, CardBody, CardFooter } from "reactstrap";
import { Row } from "react-bootstrap";

const PaymentDetails = (props) => {
  if (props.currentStep !== 2) {
    return null;
  }

  return (
    <>
      <div className="form-group row">
        <div className="col-lg-7 col-md-12 mb-3">
          <h2 className="font-weight-bold">Payment Details</h2>
          <p>Choose a payment method</p>
          <div className="row">
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div
                className="card rounded-3"
                style={{ border: "solid transparent" }}
              >
                <div
                  className="card-body"
                  style={{
                    textAlign: "center",
                    backgroundColor: "#ebebeb",
                    borderRadius: "20px",
                  }}
                >
                  <p className="pt-1">Credit Card</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div
                className="card rounded-3"
                style={{ border: "solid transparent" }}
              >
                <div
                  className="card-body"
                  style={{
                    textAlign: "center",
                    backgroundColor: "#ebebeb",
                    borderRadius: "20px",
                  }}
                >
                  <p className="pt-1">Stripe</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
              <div
                className="card rounded-3"
                style={{ border: "solid transparent" }}
              >
                <div
                  className="card-body"
                  style={{
                    textAlign: "center",
                    backgroundColor: "#ebebeb",
                    borderRadius: "20px",
                  }}
                >
                  <p className="pt-1">Google Pay</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 p-0 mt-3 mb-3">
            <div className="card" style={{ border: "solid transparent" }}>
              <div
                className="card-body"
                style={{
                  backgroundColor: "#ebebeb",
                  borderRadius: "20px",
                }}
              >
                <div className="row">
                  <div className="col-md-7">
                    <div className="form-group">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        type="text"
                        autoComplete="off"
                        value={props.values.cardNumber}
                        onBlur={props.handleBlur("cardNumber")}
                        onChange={props.handleChange("cardNumber")}
                      />
                      {props.errors.cardNumber && (
                        <small className="text-danger">
                          {props.errors.cardNumber}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="phoneNumber">Phone Number</label>
                      <input
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        type="text"
                        autoComplete="off"
                        value={props.values.phoneNumber}
                        onBlur={props.handleBlur("phoneNumber")}
                        onChange={props.handleChange("phoneNumber")}
                      />
                      {props.errors.phoneNumber && (
                        <small className="text-danger">
                          {props.errors.phoneNumber}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-5">
                    <div className="form-group">
                      <label htmlFor="cardHolderName">Cardholder Name</label>
                      <input
                        className="form-control"
                        id="cardHolderName"
                        name="cardHolderName"
                        type="text"
                        autoComplete="off"
                        value={props.values.cardHolderName}
                        onBlur={props.handleBlur("cardHolderName")}
                        onChange={props.handleChange("cardHolderName")}
                      />
                      {props.errors.cardHolderName && (
                        <small className="text-danger">
                          {props.errors.cardHolderName}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label htmlFor="cardCVV">CVV</label>
                      <input
                        className="form-control"
                        id="cardCVV"
                        name="cardCVV"
                        type="text"
                        autoComplete="off"
                        maxLength={4}
                        value={props.values.cardCVV}
                        onBlur={props.handleBlur("cardCVV")}
                        onChange={props.handleChange("cardCVV")}
                      />
                      {props.errors.cardCVV && (
                        <small className="text-danger">
                          {props.errors.cardCVV}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label htmlFor="cardMonthYear">MM/YY</label>
                      <Input
                        className="form-control"
                        id="cardMonthYear"
                        name="cardMonthYear"
                        type="month"
                        value={props.values.cardMonthYear}
                        onChange={props.handleChange("cardMonthYear")}
                      />
                      {props.errors.cardMonthYear && (
                        <small className="text-danger">
                          {props.errors.cardMonthYear}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5 col-md-12 mb-3 mt-3">
          <Card className="rounded-3">
            <CardHeader
              className="text-center text-white p-5 h4 rounded-bottom"
              style={{
                backgroundColor:
                  props.values.selectedPlan === "Plan A"
                    ? "#10a997"
                    : "#078190",
              }}
            >
              {props.values.selectedPlan === "Plan A"
                ? "I'm Pregnant"
                : "Fertility Screen"}
            </CardHeader>
            <CardBody className="p-4">
              <Row>
                {props.values.selectedPlan === "Plan A" ? (
                  <ul className="card-style-ul" style={{ listStyle: "none" }}>
                    <li>
                      <span className="mr-3">
                        <i className="font-weight-bold bi bi-check-lg"></i>
                      </span>
                      Provides hormonal support & monitoring managed for higher
                      risk pregnancy by our RRM Clinicians
                    </li>
                  </ul>
                ) : (
                  <>
                    <ul className="card-style-ul" style={{ listStyle: "none" }}>
                      <li>
                        <span className="mr-3">
                          <i className="font-weight-bold bi bi-check-lg"></i>
                        </span>
                        Check your reproductive health
                      </li>
                    </ul>
                    <ul className="card-style-ul" style={{ listStyle: "none" }}>
                      <li>
                        <span className="mr-3">
                          <i className="font-weight-bold bi bi-check-lg"></i>
                        </span>
                        Blood test kit
                      </li>
                    </ul>
                    <ul className="card-style-ul" style={{ listStyle: "none" }}>
                      <li>
                        <span className="mr-3">
                          <i className="font-weight-bold bi bi-check-lg"></i>
                        </span>
                        Follow up with RRM Clinician for results
                      </li>
                    </ul>
                  </>
                )}
              </Row>
              <Row>
                <div className="col-10 offset-1 mt-4">
                  <span>
                    Click{" "}
                    {props.values.selectedPlan === "Plan A" ? (
                      <a href="https://www.myfertilitylabs.com/prospr">here</a>
                    ) : (
                      <a href="https://www.myfertilitylabs.com/fertility-screening">
                        here
                      </a>
                    )}{" "}
                    for more information
                  </span>
                </div>
              </Row>
            </CardBody>
            <CardFooter className="text-center border-0 mt-2 bg-white">
              <p className="h5">
                {/* <b> $500/month</b> */}
                <b> ${props.values.subscriptionAmount}/month</b>
              </p>
            </CardFooter>
          </Card>
          <div className="row mt-3">
            <div className="col-6 offset-3">
              <span
                className="btn btn-block btn-user text-white font-weight-bold bg-danger"
                onClick={props.prevStep}
              >
                Change Plan
              </span>
            </div>
            <div className="col-10 offset-1 mt-3">
              <span
                className="btn btn-block btn-user text-white font-weight-bold"
                style={{ backgroundColor: "#01acee" }}
                onClick={props.nextStep}
              >
                Review Enrollment
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentDetails;
