import React from "react";

const PatientDashboard = () => {
  return (
    <>
      {/* Page Heading */}
      <div className="text-center mb-4">
        <span className="mb-0" style={{ color: "red" }}>
          *** Reminder to complete all blood work and all initial assessments in
          the ASSESS tab prior to appointment
        </span>
      </div>

      {/* appointment Bar Row */}
      <div className="row">
        {/* Content Column */}
        <div className="col-lg-12 mb-4">
          {/* Project Card Example */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 text-bold">
                    Upcomming Appointment:
                  </label>
                </div>
                <span
                  type="button"
                  className="btn btn-user btn-block"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  Appointments
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bloodwork Bar Row */}
      <div className="row">
        {/* Content Column */}
        <div className="col-lg-12 mb-4">
          {/* Project Card Example */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 text-bold">
                    Upcomming Bloodwork:
                  </label>
                </div>
                <span
                  type="button"
                  className="btn-user btn-block text-center"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  Bloodwork <br />
                  <a href="/">LabRequisition.pdf (download)</a>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Most Recent Bloodwork Bar Row */}
      <div className="row">
        {/* Content Column */}
        <div className="col-lg-12 mb-4">
          {/* Project Card Example */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 text-bold">
                    Most Recent Bloodwork:
                  </label>
                </div>
                <span
                  type="button"
                  className="btn btn-user btn-block"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  Blood Work
                  <i className="float-right bi bi-download"></i>
                </span>
                <hr />
                <span
                  type="button"
                  className="btn btn-user btn-block"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  Blood Work
                  <i className="float-right bi bi-download"></i>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bloodwork Bar Row */}
      <div className="row">
        {/* Content Column */}
        <div className="col-lg-12 mb-4">
          {/* Project Card Example */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 text-bold">Notes:</label>
                </div>
                <textarea
                  rows="8"
                  className="btn btn-block"
                  style={{ backgroundColor: "#e0e1e3", color: "black" }}
                >
                  To do/Plan/Next Steps
                </textarea>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
