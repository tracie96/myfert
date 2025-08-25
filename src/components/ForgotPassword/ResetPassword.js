import { NavLink } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { resetPassword } from "../redux/AuthController";
import { useLocation, useNavigate } from "react-router-dom";
import forgot_password from "../../assets/images/auth/forgotPassword.svg";
import { Divider, Card, Form, Input, Alert } from "antd";

const initialValues = {
  password: "",
  confirmPassword: "",
};

const validateResetPassword = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Please enter a new password"),
});

function ResetPassword() {
  const [showSpinner, setShowSpinner] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { Item: FormItem } = Form;
  const [password, setPassword] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const { appErr, serverErr } = useSelector((state) => state.authentication);

  const session = new URLSearchParams(location.search).get("Token");

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateResetPassword,
    onSubmit: async (values) => {
      console.log("Form Submitted");
      console.log("Password:", values.password);
      console.log("Token:", session);

      // Clear previous messages
      setSuccessMessage("");
      setErrorMessage("");

      try {
        setShowSpinner(true);
        const payload = {
          session: session,
          password: values.password,
        };

        const response = await dispatch(resetPassword(payload));

        // Check if the action was fulfilled (successful)
        if (response.meta && response.meta.requestStatus === 'fulfilled') {
          setSuccessMessage("Password reset successful! Redirecting to login...");
          setShowSpinner(false);
          console.log("Password reset successful: ", response);
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          setErrorMessage("Password reset failed. Please try again.");
          setShowSpinner(false);
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        setErrorMessage("An error occurred while resetting your password. Please try again.");
        setShowSpinner(false);
      }
    },
  });

  // Handle Redux errors
  useEffect(() => {
    if (appErr) {
      setErrorMessage(appErr);
      setShowSpinner(false);
    }
    if (serverErr) {
      setErrorMessage(serverErr);
      setShowSpinner(false);
    }
  }, [appErr, serverErr]);

  useEffect(() => {
    const validatePassword = (password) => {
      const validations = {
        minLength: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };
      return validations;
    };

    const validations = validatePassword(password);
    setPasswordValidations(validations);
  }, [password]);

  return (
    <div className="d-flex align-items-center justify-content-center bg-gradient-white min-vh-100">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="row no-gutters">
                <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
                  <img
                    src={forgot_password}
                    alt="Forgot Password"
                    className="img-fluid"
                  />
                </div>
                <div className="col-lg-6">
                  <div className="p-5">
                    <h1 className="h4 text-gray-900 mb-2">
                      Reset Your Password
                    </h1>
                    <p className="mb-4">
                      Enter your new password to regain access to your account!
                    </p>

                    {/* Success Message */}
                    {successMessage && (
                      <Alert
                        message="Success"
                        description={successMessage}
                        type="success"
                        showIcon
                        className="mb-3"
                      />
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                      <Alert
                        message="Error"
                        description={errorMessage}
                        type="error"
                        showIcon
                        className="mb-3"
                      />
                    )}

                    <form onSubmit={handleSubmit}>
                      <FormItem
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "! Please enter your password.",
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter Password"
                          style={{ borderColor: "#000" }}
                          value={values.password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          onFocus={() => setPasswordFocused(true)}
                        />
                      </FormItem>
                      {errors.password && (
                        <small className="text-danger">{errors.password}</small>
                      )}

                      {passwordFocused && (
                        <Card>
                          <div>Password must contain:</div>
                          <div
                            style={{
                              color: passwordValidations.minLength
                                ? "green"
                                : "red",
                            }}
                          >
                            {passwordValidations.minLength ? "✓" : "✗"} 8
                            characters minimum
                          </div>
                          <div
                            style={{
                              color: passwordValidations.lowercase
                                ? "green"
                                : "red",
                            }}
                          >
                            {passwordValidations.lowercase ? "✓" : "✗"} One
                            lowercase character
                          </div>
                          <div
                            style={{
                              color: passwordValidations.uppercase
                                ? "green"
                                : "red",
                            }}
                          >
                            {passwordValidations.uppercase ? "✓" : "✗"} One
                            uppercase character
                          </div>
                          <div
                            style={{
                              color: passwordValidations.number
                                ? "green"
                                : "red",
                            }}
                          >
                            {passwordValidations.number ? "✓" : "✗"} One number
                          </div>
                          <div
                            style={{
                              color: passwordValidations.specialChar
                                ? "green"
                                : "red",
                            }}
                          >
                            {passwordValidations.specialChar ? "✓" : "✗"} One
                            special character
                          </div>
                        </Card>
                      )}

                      <button
                        type="submit"
                        disabled={showSpinner}
                        className="btn btn-user btn-block mt-4"
                        style={{ backgroundColor: "#01ADF0", color: "#fff" }}
                      >
                        {showSpinner ? (
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                        ) : (
                          "Reset Password"
                        )}
                      </button>
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
                        >
                          Sign In!
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
  );
}

export default ResetPassword;
