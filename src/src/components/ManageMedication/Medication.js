import React from "react";

const Medication = () => {
  return (
    <>
      <div className="row">
        <div className="col-md-10 offset-md-1 mt-4">
          <form className="user">
            <div className="form-group col-lg-12">
              <label className="h3 form-label fw-bold">
                Total Medications: <span>3</span>
              </label>
            </div>
            <p
              type="text"
              className="block-learn-info"
              style={{ textAlign: "left" }}
            >
              <sapn className="text-blue">Acetaminophen</sapn>
              <br />
              1-2 mg
              <br />
              2 times a day
              <br />
              Everyday Program information
            </p>
          </form>
          <div className="row">
            <div className="col-md-6">
              <form className="user">
                <p
                  type="text"
                  className="block-learn-info"
                  style={{ textAlign: "left" }}
                >
                  <sapn className="text-blue">Acetaminophen</sapn>
                  <br />
                  1-2 mg
                  <br />
                  2 times a day
                  <br />
                  Everyday Program information
                </p>
              </form>
            </div>
            <div className="col-md-6">
              <form className="user">
                <p
                  type="text"
                  className="block-learn-info"
                  style={{ textAlign: "left" }}
                >
                  <sapn className="text-blue">Acetaminophen</sapn>
                  <br />
                  1-2 mg
                  <br />
                  2 times a day
                  <br />
                  Everyday Program information
                </p>
              </form>
            </div>
            <div className="col-md-4">
              <form className="user">
                <p
                  type="text"
                  className="block-learn-info"
                  style={{ textAlign: "left" }}
                >
                  <sapn className="text-blue">Acetaminophen</sapn>
                  <br />
                  1-2 mg
                  <br />
                  2 times a day
                  <br />
                  Everyday Program information
                </p>
              </form>
            </div>
            <div className="col-md-4">
              <form className="user">
                <p
                  type="text"
                  className="block-learn-info"
                  style={{ textAlign: "left" }}
                >
                  <sapn className="text-blue">Acetaminophen</sapn>
                  <br />
                  1-2 mg
                  <br />
                  2 times a day
                  <br />
                  Everyday Program information
                </p>
              </form>
            </div>
            <div className="col-md-4">
              <form className="user">
                <p
                  type="text"
                  className="block-learn-info"
                  style={{ textAlign: "left" }}
                >
                  <sapn className="text-blue">Acetaminophen</sapn>
                  <br />
                  1-2 mg
                  <br />
                  2 times a day
                  <br />
                  Everyday Program information
                </p>
              </form>
            </div>
          </div>
          <div className="row mb-4 justify-content-center">
            <button className="col-md-3 btn btn-primary m-2 p-3 b-r-25 shadow">
              Order Prescription
            </button>
            <button className="col-md-3 btn btn-primary m-2 p-3 b-r-25 shadow">
              Fax Prescription
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Medication;
