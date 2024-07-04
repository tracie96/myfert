import React from "react";
import Calendar from "./Calendar";

const Appointment = () => {
  return (
    <>
      <div className="row">
        {/* Content Column */}
        <div className="col-lg-12 mb-4">
          <div className="card shadow mb-4">
            <div className="card-body">
              <Calendar />
            </div>
          </div>
        </div>
        <div className="col-lg-12 mb-4">
          {/* Project Card Example */}
          <div className="card shadow mb-4">
            <div className="card-body">
              <form className="user">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1  font-weight-bold">
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
              <form className="user mt-4">
                <div className="form-group col-lg-12">
                  <label className="form-label ml-1 font-weight-bold">
                    Recommended appointment schedule:
                  </label>
                  <p className="ml-1 text-sm" style={{ color: "black" }}>
                    Dependent on the patient's plan (Day 3 or ProSPr)
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
