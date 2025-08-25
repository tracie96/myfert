import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../redux/AuthController";
import forgot_password from "../../assets/images/auth/forgotPassword.svg";
import { Divider } from "antd";

const initialValues = {
  email: "",
};

const validateForgotPassword = Yup.object({
  email: Yup.string()
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Please enter a valid email",
    )
    .required("Please enter email"),
});

function ForgotPassword({ closeModal }) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState("");
  const dispatch = useDispatch();

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateForgotPassword,

    onSubmit: async (values) => {
      const transformedValues = { value: values.email };
      console.log(values);
      try {
        setShowSpinner(true);
        const response = await dispatch(forgotPassword(transformedValues));
        if (response) {
          setShowSpinner(false);
          setEmailSent(true);
          setSentEmail(values.email);
          console.log("email success sent: ", response);
        }
      } catch (error) {
        setShowSpinner(false);
        console.error("Error sending email:", error);
      } finally {
        setShowSpinner(false);
      }
    },
  });

  // Show confirmation message after email is sent
  if (emailSent) {
    return (
      <div className="bg-gradient-white">
        <div className="container py-1">
          <div className="row justify-content-center mt-4">
            <div className="col-xl-10 col-lg-12 col-md-9">
              <div className="">
                <div className="">
                  <div className="row">
                    <div className="col-lg-6 d-none d-lg-block">
                      <img src={forgot_password} alt="forgot" />
                    </div>
                    <div className="col-lg-6 mt-lg-5">
                      <div className="">
                        <div className="text-center">
                          <h1 className="h4 mb-2" style={{ color: "#01ACEE" }}>
                            Check Your Email
                          </h1>
                          <div className="m-4 p-2">
                            <p className="mb-3">
                              We've sent a password reset link to:
                            </p>
                            <p className="font-weight-bold text-primary mb-4">
                              {sentEmail}
                            </p>
                            <p className="text-muted">
                              Please check your email and click the link to reset your password. 
                              If you don't see the email, check your spam folder.
                            </p>
                          </div>
                        </div>
                        <Divider style={{ marginTop: "10%" }} />
                        <div
                          className="text-center"
                          style={{ paddingBottom: 30 }}
                        >
                          <span style={{ fontSize: "13px" }}>Back to </span>
                          <NavLink
                            className="small"
                            to="/"
                            style={{ color: "#01ADF0" }}
                            onClick={()=>closeModal()}
                          >
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
    );
  }

  return (
    <div className="bg-gradient-white">
      <div className="container py-1">
        <div className="row justify-content-center mt-4">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="">
              <div className="">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block">
                    <img src={forgot_password} alt="forgot" />
                  </div>
                  <div className="col-lg-6 mt-lg-5">
                    <div className="">
                      <div className="text-center">
                        <h1 className="h4 mb-2" style={{ color: "#01ACEE" }}>
                          Forgot Your Password?
                        </h1>
                        <p className="m-4 p-2">
                          We get it, stuff happens. Just enter your email
                          address below and we'll send you a link to reset your
                          password!
                        </p>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <input
                            type="email"
                            className="form-control form-control-user"
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
                        <button
                          type="submit"
                          className="btn btn-user btn-block"
                          disabled={showSpinner}
                          style={{ background: "#01ADF0", color: "#fff" }}
                        >
                          {showSpinner ? (
                            <span>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            </span>
                          ) : (
                            "Confirm"
                          )}
                        </button>
                      </form>
                      <Divider style={{ marginTop: "10%" }} />
                      <div
                        className="text-center"
                        style={{ paddingBottom: 30 }}
                      >
                        <span style={{ fontSize: "13px" }}>Back to </span>
                        <NavLink
                          className="small"
                          to="/"
                          style={{ color: "#01ADF0" }}
                          onClick={()=>closeModal()}
                        >
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
  );
}

export default ForgotPassword;
