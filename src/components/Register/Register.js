import { NavLink } from "react-router-dom";
import { useState } from "react";
import fertilityImage from "../../assets/images/auth/fertilityImage.svg";
import Clinician from "../../assets/images/auth/clinicians.png";
import Patient from "../../assets/images/auth/patients.png";
import PatientSignup from "./SignUpPages/PatientSignup";
import "./Register.css"; // Import the CSS file
import DoctorRegister from "./SignUpPages/DoctorOverview";

const Register = ({ navigator }) => {
  const [userRole, setUserRole] = useState(null);
  const [isClinicianHovered, setIsClinicianHovered] = useState(false);
  const [isPatientHovered, setIsPatientHovered] = useState(false);

  const setRole = (role) => {
    console.log({ role });
    setUserRole(role.toString());
  };

  const handleClinicianMouseEnter = () => {
    setIsClinicianHovered(true);
    setIsPatientHovered(false);
  };

  const handlePatientMouseEnter = () => {
    setIsPatientHovered(true);
    setIsClinicianHovered(false);
  };

  const handleMouseLeave = () => {
    setIsClinicianHovered(false);
    setIsPatientHovered(false);
  };

  return (
    <div className="bg-gradient-white">
      {userRole === null && (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-12 pt-md-3">
              <div className="card o-hidden border-0">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="p-4">
                        <div className="text-center">
                          <div className="row">
                            <div className="col-lg-12 py-4 mb-4 text-bold bg-login-imageF">
                              <img
                                src={fertilityImage}
                                alt="loginImage"
                                style={{ maxWidth: "50%", height: "auto" }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="row justify-content-center">
                            <div className="col-lg-10">
                              <h1
                                className="h4 mb-4"
                                style={{ color: "#01ACEE", fontWeight: 700 }}
                              >
                                Join My Fertility Labs as:
                              </h1>
                            </div>
                          </div>
                          <div className="row text-center image-row">
                            <div
                              className={`col-lg-6 mb-4 px-2 ${
                                isPatientHovered ? "hover-opacity" : ""
                              }`}
                              onMouseEnter={handleClinicianMouseEnter}
                              onMouseLeave={handleMouseLeave}
                              onClick={() => setRole(4)}
                            >
                              <div
                                className="card clickable-card"
                                style={{
                                  backgroundColor: isClinicianHovered
                                    ? "#CEF2F4"
                                    : "",
                                }}
                              >
                                <div className="card-body image-container">
                                  <h5 className="overlay-text">Clinician</h5>
                                  <img
                                    src={Clinician}
                                    alt="Clinician"
                                    className="card-img-top"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div
                              className={`col-lg-6 mb-4 px-2 ${
                                isClinicianHovered ? "hover-opacity" : ""
                              }`}
                              onMouseEnter={handlePatientMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              <div
                                className="card clickable-card"
                                style={{
                                  backgroundColor: isPatientHovered
                                    ? "#EFD0BD"
                                    : "",
                                }}
                                onClick={() => setRole(2)}
                              >
                                <div className="card-body image-container">
                                  <h5 className="overlay-text">Patient</h5>
                                  <img
                                    src={Patient}
                                    alt="Patient"
                                    className="card-img-top"
                                    style={{ maxWidth: "100%", height: "auto" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <hr className="custom-hr" />
                          <div className="text-center">
                            <span style={{ fontSize: "13px", marginTop: 50 }}>
                              Already have an account?{" "}
                            </span>
                            <NavLink className="small" to="/">
                              Sign In!
                            </NavLink>
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
      )}
      {/* Conditional Rendering for Sign Up */}
      {userRole && (
        <div className="row justify-content-center">
          <div className="col-lg-12">
            {userRole === "4" && <DoctorRegister userRole={userRole} />}
            {userRole === "2" && <PatientSignup />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
