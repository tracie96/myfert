import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal, Button } from "antd";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import NursePractitionerImage from "../../../assets/images/auth/nurse_practitioner.jpeg";
import DoctorImage from "../../../assets/images/auth/clinicians.png";
import PharmacistClinicianImage from "../../../assets/images/auth/pharmacist_clinician.jpeg";
import NutritionalPractitionerImage from "../../../assets/images/auth/nutritional_practitioner.jpeg";
import FertilitySupportPractitionerImage from "../../../assets/images/auth/fertility_support.jpeg";
import FertilityEducatorImage from "../../../assets/images/auth/fertility_educator.jpeg";
import "../Register.css";

const professionCategories = [
  { name: "Nurse Practitioner", image: NursePractitionerImage, role: 5 },
  { name: "Doctor", image: DoctorImage, role: 3 },
  { name: "Pharmacist Clinician", image: PharmacistClinicianImage, role: 6 },
  {
    name: "Nutritional Practitioner",
    image: NutritionalPractitionerImage,
    role: 7,
  },
  {
    name: "Fertility Support Practitioner",
    image: FertilitySupportPractitionerImage,
    role: 8,
  },
  { name: "Fertility Coach", image: FertilityEducatorImage, role: 9 },
];

const DoctorRegister = () => {
  const [userRole, setUserRole] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleName, setRoleName] = useState(null);
  const navigate = useNavigate();

  const handleMouseEnter = (role) => {
    setHoveredRole(role);
  };

  const handleMouseLeave = () => {
    setHoveredRole(null);
  };

  const handleNavigation = (role, name) => {
    console.log(role, "role");
    setSelectedRole(role);
    setRoleName(name);

    if (role === 5 || role === 3 || role === 6) {
      setIsModalVisible(true);
    } else {
      navigate("/clinicianSignup", { state: { role: role, name: name } });
    }
  };

  const handleOk = (isAccessor) => {
    if (selectedRole !== null && roleName !== null) {
      setUserRole(selectedRole);
      navigate("/clinicianSignup", {
        state: { role: selectedRole, name: roleName, isAccessor },
      });
    }
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
                            <div className="col-lg-12">
                              <h1
                                className="h4 mb-4 overlay-text"
                                style={{ color: "#01ACEE", fontWeight: 700 }}
                              >
                                Join My Fertility Labs as:
                              </h1>
                            </div>
                          </div>
                          <div className="row text-center image-row">
                            {professionCategories.map((category, index) => (
                              <div
                                key={index}
                                className={`col-lg-4 mb-4 px-2 ${hoveredRole === category.role ? "" : "hover-opacity"}`}
                                onMouseEnter={() =>
                                  handleMouseEnter(category.role)
                                }
                                onMouseLeave={handleMouseLeave}
                                onClick={() =>
                                  handleNavigation(category.role, category.name)
                                }
                              >
                                <div
                                  className="card clickable-card"
                                  style={{
                                    backgroundColor:
                                      hoveredRole === category.role
                                        ? "#CEF2F4"
                                        : "",
                                  }}
                                >
                                  <div className="card-body image-container">
                                    <h5 className="overlay-text">
                                      {category.name}
                                    </h5>
                                    <img
                                      src={category.image}
                                      alt={category.name}
                                      className="card-img-top"
                                      style={{
                                        maxWidth: "100%",
                                        height: "auto",
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
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

      <Modal
        title="Initial Accessor Confirmation"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={() => handleOk(false)}>
            No
          </Button>,
          <Button key="submit" type="primary" onClick={() => handleOk(true)}>
            Yes
          </Button>,
        ]}
      >
        <p>Do you want to be an initial accessor with the role: {roleName}?</p>
      </Modal>
    </div>
  );
};

export default DoctorRegister;
