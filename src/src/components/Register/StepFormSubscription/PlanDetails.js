import { Card } from "antd";
import React from "react";
import { Row } from "react-bootstrap";
import { CardFooter, CardHeader, CardBody } from "reactstrap";

const PlanDetails = (props) => {
  if (props.currentStep !== 1) {
    return null;
  }

  return (
    <>
      <div className="form-group row">
        <h2 className="font-weight-bold">Subscription Plans</h2>
        <p>Choose which plan you want to purchase</p>
        <div className="col-lg-6 col-md-12 mb-3 mb-sm-3">
          <Card className="rounded-3">
            <CardHeader
              className="text-center text-white p-5 h4 rounded-bottom"
              style={{ backgroundColor: "#10a997" }}
            >
              I'm Pregnant
            </CardHeader>
            <CardBody className="p-5">
              <Row>
                <ul className="card-style-ul" style={{ listStyle: "none" }}>
                  <li>
                    <span className="mr-3">
                      <i className="font-weight-bold bi bi-check-lg"></i>
                    </span>
                    Provides hormonal support & monitoring managed for higher
                    risk pregnancy by our RRM Clinicians
                  </li>
                </ul>
              </Row>
              <Row>
                <div className="col-10 offset-1 mt-4">
                  <span>
                    Click{" "}
                    <a href="https://www.myfertilitylabs.com/prospr">here</a>{" "}
                    for more information
                  </span>
                </div>
              </Row>
            </CardBody>
            <CardFooter className="text-center border-0 mt-2 bg-white">
              <p className="h4">
                <b>$500/month</b>
              </p>
              <span
                className="btn btn-block btn-user text-white font-weight-bold"
                style={{ backgroundColor: "#10a997" }}
                value="Plan A"
                onClick={() => {
                  props.handleShowModal(1);
                  props.setFieldValue("selectedPlan", "Plan A");
                }}
              >
                Get Started!
              </span>
            </CardFooter>
          </Card>
        </div>
        <div className="col-lg-6 col-md-12 mb-3 mb-sm-0">
          <Card className="rounded-3">
            <CardHeader
              className="text-center text-white p-5 h4 rounded-bottom"
              style={{ backgroundColor: "#078190" }}
            >
              Fertility Screen
            </CardHeader>
            <CardBody className="p-5">
              <Row>
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
              </Row>

              <Row>
                <div className="col-10 offset-1">
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
            <CardFooter className="text-center border-0 mt-3 bg-white">
              <span
                className="btn btn-block btn-user text-white font-weight-bold"
                style={{ backgroundColor: "#078190" }}
                value="Plan B"
                onClick={() => {
                  props.handleShowModal(2);
                  props.setFieldValue("selectedPlan", "Plan B");
                  // props.handleChange("selectedPlan");
                }}
              >
                Get Started!
              </span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlanDetails;
