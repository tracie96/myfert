import { useRef, useState } from "react";
import "../Register.css";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import Spinner from "react-bootstrap/Spinner";
import CustomModal from "../../global_component/CustomModal";
import { Card, Row } from "react-bootstrap";
import { postRegister } from "../../redux/AuthController";
import { useDispatch } from "react-redux";

const CoachSignup = (userRole) => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showTermsConditionsModal, setShowTermsConditionsModal] =
    useState(false);
  const fileInputRef = useRef(null);

  const initialValues = {
    role: userRole || "3", // 4 is for patient
    userName: "",
    firstName: "",
    lastName: "",
    gender: "",
    password: "",
    cpassword: "",
    email: "",
    address: "",
    appartmentOrSuite: "",
    country: "",
    stateProvince: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    medicalNumberOrProvinceHealthNumber: "",
    dob: "",
    height: "",
    weight: "",
    isSMS: "",
    isAgreeToShareInformation: "",
    isAcceptTermsAndCondition: "",
    licenseDocument: "",
  };

  const validateRegister = Yup.object().shape({
    userName: Yup.string().min(3).required("Please enter user name"),
    firstName: Yup.string().min(3).required("Please enter first name"),
    lastName: Yup.string().min(3).required("Please enter last name"),
    password: Yup.string().min(3).required("Please enter password"),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matched")
      .required("Please enter password"),
    email: Yup.string()
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
        "Please enter a valid email",
      )
      .required("Please enter email"),
    phoneNumber: Yup.string().min(8).required("Please enter phone number"),
    dob: Yup.date().required("Please select your date of birth"),
    isAcceptTermsAndCondition: Yup.boolean()
      .required("Please accept terms and conditions")
      .oneOf([true], "Please accept terms and conditions"),
    // licenseDocument: Yup.string().required("Please upload document"),
    licenseDocument: Yup.mixed()
      .required("Please upload document")
      .test("fileSize", "File size must be less than 2MB", (value) => {
        console.log("file", value);
        if (!value) return true; // No file selected, consider it valid
        const isFileSizeValid = value.size <= 2 * 1024 * 1024; // 2 MB limit
        if (!isFileSizeValid) {
          throw new Yup.ValidationError(
            "File size must be less than 2MB",
            value,
            "licenseDocument",
          );
        }
        return isFileSizeValid;
      }),
  });

  const handleChange = (name) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const { values, handleBlur, handleSubmit, errors, setValues, setFieldValue } =
    useFormik({
      initialValues: initialValues,
      validationSchema: validateRegister,
      handleChange: handleChange,
      onSubmit: async (values) => {
        values.role = userRole; // setting userRole there
        setShowSpinner(true);
        await dispatch(postRegister(values));
        setShowSpinner(false);
      },
    });

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setFieldValue("licenseDocument", file);
    } else if (file) {
      setFieldValue("licenseDocument", null);
      fileInputRef.current.value = "";
      alert("File Size exceeds from 2MB");
    } else {
      setFieldValue("licenseDocument", null);
      fileInputRef.current.value = "";
    }
    // else {
    //   setFieldValue("licenseDocument", null);
    //   fileInputRef.current.value = "";
    //   alert("File Size exceeds from 2MB");
    // }
  };

  //#region Modal show
  const handleShowModal = () => {
    setShowTermsConditionsModal(true);
  };
  const handleCloseModal = () => {
    setShowTermsConditionsModal(false);
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
                  >
                    <span>Sign In</span>
                  </NavLink>
                </form>
              </nav>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-xl-9 col-lg-10 col-md-12">
              <div className="card o-hidden border-0  my-3">
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="p-5">
                        <form className="user" onSubmit={handleSubmit}>
                          <input
                            type="hidden"
                            name="role"
                            value={values.role}
                          />

                          <div className="row">
                            <div className="form-group col-lg-12 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputUserName"
                              >
                                User Name
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                id="exampleInputUserName"
                                placeholder="Enter User Name"
                                value={values.userName}
                                onBlur={handleBlur("userName")}
                                onChange={handleChange("userName")}
                              />
                              {errors.userName && (
                                <small className="text-danger">
                                  {errors.userName}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-lg-6 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputFirstName"
                              >
                                First Name
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                id="exampleInputFirstName"
                                placeholder="Enter First Name"
                                value={values.firstName}
                                onBlur={handleBlur("firstName")}
                                onChange={handleChange("firstName")}
                              />
                              {errors.firstName && (
                                <small className="text-danger">
                                  {errors.firstName}
                                </small>
                              )}
                            </div>

                            <div className="form-group col-lg-6 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputLastName"
                              >
                                Last Name
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                id="exampleInputLastName"
                                placeholder="Enter Last Name"
                                value={values.lastName}
                                onBlur={handleBlur("lastName")}
                                onChange={handleChange("lastName")}
                              />
                              {errors.lastName && (
                                <small className="text-danger">
                                  {errors.lastName}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-lg-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputPassword"
                              >
                                Password
                              </label>
                              <input
                                type="password"
                                className="form-control form-control-user"
                                id="exampleInputPassword"
                                placeholder="Enter Password"
                                value={values.password}
                                onBlur={handleBlur("password")}
                                onChange={handleChange("password")}
                              />
                              {errors.password && (
                                <small className="text-danger">
                                  {errors.password}
                                </small>
                              )}
                            </div>

                            <div className="form-group col-lg-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputCPassword"
                              >
                                Confirm Password
                              </label>
                              <input
                                type="password"
                                className="form-control form-control-user"
                                id="exampleInputCPassword"
                                placeholder="Enter Confirm Password"
                                value={values.cpassword}
                                onBlur={handleBlur("cpassword")}
                                onChange={handleChange("cpassword")}
                              />
                              {errors.cpassword && (
                                <small className="text-danger">
                                  {errors.cpassword}
                                </small>
                              )}
                            </div>

                            <div className="form-group col-lg-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputEmail"
                              >
                                Email
                              </label>
                              <input
                                className="form-control form-control-user"
                                type="email"
                                id="exampleInputEmail"
                                aria-describedby="emailHelp"
                                placeholder="Enter Email Address..."
                                value={values.email}
                                onBlur={handleBlur("email")}
                                onChange={handleChange("email")}
                              />
                              {errors.email && (
                                <small className="text-danger">
                                  {errors.email}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-lg-6 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputNumber"
                              >
                                Phone Number
                              </label>
                              <input
                                type="text"
                                className="form-control form-control-user"
                                id="exampleInputNumber"
                                placeholder="Enter Phone Number"
                                value={values.phoneNumber}
                                onBlur={handleBlur("phoneNumber")}
                                onChange={handleChange("phoneNumber")}
                              />
                              {errors.phoneNumber && (
                                <small className="text-danger">
                                  {errors.phoneNumber}
                                </small>
                              )}
                            </div>

                            <div className="form-group col-lg-6 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputDOB"
                                title="Date Of Birth"
                              >
                                DOB
                              </label>
                              <input
                                type="date"
                                className="form-control form-control-user"
                                id="exampleInputDOB"
                                value={values.dob}
                                onChange={handleChange("dob")}
                              />
                              {errors.dob && (
                                <small className="text-danger">
                                  {errors.dob}
                                </small>
                              )}
                            </div>
                          </div>

                          <div className="row">
                            <div className="form-group col-lg-12 col-sm-12">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id="isAcceptTermsAndCondition"
                                  checked={values.isAcceptTermsAndCondition}
                                  onChange={handleChange(
                                    "isAcceptTermsAndCondition",
                                  )}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="isAcceptTermsAndCondition"
                                >
                                  I Accept{" "}
                                  <span
                                    className="text-primary"
                                    onClick={handleShowModal}
                                  >
                                    Terms & Conditions
                                  </span>
                                </label>
                              </div>
                              {errors.isAcceptTermsAndCondition && (
                                <small className="text-danger">
                                  {errors.isAcceptTermsAndCondition}
                                </small>
                              )}
                            </div>

                            <div className="form-group col-lg-12 col-sm-12">
                              <label
                                className="form-label ml-1 text-bold"
                                htmlFor="exampleInputLicense"
                              >
                                Credentials/ License/ Insurance
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                id="exampleInputLicense"
                                // onChange={handleChange("licenseDocument")}
                                ref={fileInputRef}
                                onChange={(event) => handleFileChange(event)}
                              />
                              {errors.licenseDocument && (
                                <small className="text-danger">
                                  {errors.licenseDocument}
                                </small>
                              )}
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary btn-user btn-block"
                            disabled={showSpinner}
                          >
                            {showSpinner && (
                              <span>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </span>
                            )}{" "}
                            CREATE ACCOUNT
                          </button>
                          <div className="text-center">
                            <NavLink className="small" to="/">
                              Already have an account? Sign In Here
                            </NavLink>
                          </div>
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

      <CustomModal
        show={showTermsConditionsModal}
        onHide={handleCloseModal}
        size="lg"
        classes="bg-white text-black font-weight-bold py-2"
        title={"Terms And Conditions"}
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
    </>
  );
};

export default CoachSignup;
