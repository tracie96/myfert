import React from "react";
import { Button } from "reactstrap";
import Spinner from "react-bootstrap/Spinner";
import StripeCheckOutButton from "./StripeCheckOutButton";

const PaymentConfirmation = (props) => {
  // if (props.currentStep !== 3)
  if (props.currentStep !== 2) {
    return null;
  }

  console.log("payment confirmation : ", props.values);

  return (
    <>
      <div className="form-group row">
        <div className="col-10 offset-1 p-0 mb-2">
          <div className="col-12 mb-3">
            <h4 className="font-weight-bold">Confirmation</h4>
          </div>
          <div className="card" style={{ border: "solid transparent" }}>
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
                    <label className="h5 font-weight-bold">Summary</label>
                  </div>
                  <hr
                    style={{
                      border: "1px solid",
                    }}
                  />
                  <div className="row">
                    <div className="col-md-6">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Selected Plan
                      </label>
                    </div>
                    <div className="col-md-5">
                      <label style={{ fontSize: "14px" }}>
                        {props.values.selectedPlan}
                      </label>
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Date Of Submission
                      </label>
                    </div>
                    <div className="col-md-5">
                      <label style={{ fontSize: "14px" }}>Today</label>
                    </div>
                    <div className="col-md-6">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Email Address
                      </label>
                    </div>
                    <div className="col-md-5">
                      <label style={{ fontSize: "14px" }}>
                        {props.values.email}
                      </label>
                    </div>
                    {/* <div className="col-md-6">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Phone Number
                      </label>
                    </div>
                    <div className="col-md-5">
                      <label style={{ fontSize: "14px" }}>
                        {props.values.phoneNumber}
                      </label>
                    </div> */}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label className="h5 font-weight-bold">Billing Total</label>
                  </div>
                  <hr
                    style={{
                      border: "1px solid",
                    }}
                  />
                  <div className="row">
                    <div className="col-md-6 col-sm-5 col-xs-5">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Subtotal
                      </label>
                    </div>
                    <div className="col-md-4 col-sm-7 col-xs-7 text-end">
                      <label style={{ fontSize: "14px" }}>
                        {" "}
                        {props.values.subscriptionAmount}$
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-8 col-sm-12 col-xs-12">
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
                    <div className="col-md-6 col-sm-6 col-xs-5">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Payment Method
                      </label>
                    </div>
                    <div className="col-md-5 col-sm-6 col-xs-7">
                      <label style={{ fontSize: "14px" }}>Stripe</label>
                    </div>
                    {/* <div className="col-md-6 col-sm-5 col-xs-5">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Reference Number
                      </label>
                    </div>
                    <div className="col-md-5 col-sm-7 col-xs-7">
                      <label style={{ fontSize: "14px" }}>123456</label>
                    </div>
                    <div className="col-md-6 col-sm-5 col-xs-5">
                      <label style={{ fontSize: "14px", fontWeight: "700" }}>
                        Payment Method
                      </label>
                    </div>
                    <div className="col-md-5 col-sm-7 col-xs-7">
                      <label style={{ fontSize: "14px" }}>xxxx1234</label>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-3 col-sm-4 col-xs-6 mb-2">
              <span
                className="btn btn-user btn-block text-white font-weight-bold bg-danger"
                onClick={() => {
                  props.prevStep();
                  props.emptyCheckOutPayloadValue();
                }}
              >
                Back
              </span>
            </div>
            {!props.checkOutPayload && (
              <div className="col-md-9 col-sm-4 col-xs-12 text-end">
                <Button
                  className="btn btn-user btn-block text-white font-weight-bold"
                  style={{ backgroundColor: "#01acee" }}
                  disabled={props.showSpinner}
                >
                  Confirm Enrollment{" "}
                  {props.showSpinner && (
                    <span>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </span>
                  )}
                </Button>
              </div>
            )}
            {props.checkOutPayload && (
              <>
                <div className="col-md-6 col-sm-4 col-xs-12 text-end">
                  <Button
                    className="btn btn-user btn-block text-white font-weight-bold"
                    style={{ backgroundColor: "#01acee" }}
                    disabled={true}
                  >
                    Confirm Enrollment
                  </Button>
                </div>
                <div className="col-md-3 col-sm-4 col-xs-12 text-end">
                  <a
                    className="btn btn-user btn-block text-white font-weight-bold"
                    style={{ backgroundColor: "green" }}
                    href={props.checkOutPayload.checkOutURL}
                  >
                    Confirm CheckOut
                  </a>
                  {/* <StripeCheckOutButton
                    stripePublishableKey={props.checkOutPayload.publicKey}
                    stripeSessionId={props.checkOutPayload.sessionId}
                  /> */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentConfirmation;
