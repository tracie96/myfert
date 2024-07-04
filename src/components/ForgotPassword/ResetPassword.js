import { NavLink, Navigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import PasswordInput from "../global_component/PasswordInput";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { resetPassword } from "../redux/AuthController";

function ResetPassword() {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const params = useParams();
  console.log("params:", params);

  const initialValues = {
    id: params.id ? params.id : "",
    newpassword: "",
    confirmPassword: "",
  };

  const validateResetPassword = Yup.object({
    newpassword: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("Please enter password"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newpassword")], "Password not matched")
      .required("Please enter password"),
  });

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateResetPassword,
    onSubmit: async (values) => {
      console.log(values);
      try {
        setShowSpinner(true);
        const response = await dispatch(resetPassword(values));
        if (response) {
          setShowSpinner(false);
        }
      } catch (error) {
      } finally {
      }
    },
  });

  if (!params.id) {
    return <Navigate to="/" />;
  }

  return (
    <div className="bg-gradient-white">
      <div className="container py-1">
        <div className="row justify-content-center mt-3">
          <div className="col-xl-12 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-password-reset-image"></div>
                  <div className="col-lg-6 mt-lg-5">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-2">
                          Reset Your Password
                        </h1>
                        <p className="mb-4">
                          Just enter your new password and continue with your
                          account!
                        </p>
                      </div>
                      <form className="user" onSubmit={handleSubmit}>
                        {/* <input
                          type="hidden"
                          name="id"
                          value={loggedInUser.id}
                        /> */}
                        <PasswordInput
                          label=""
                          name="newpassword"
                          placeHolder="New Password"
                          onChange={handleChange("newpassword")}
                          onBlur={handleBlur("newpassword")}
                          value={values.newpassword}
                        />
                        {errors.newpassword && (
                          <small className="text-danger">
                            {errors.newpassword}
                          </small>
                        )}
                        <PasswordInput
                          label=""
                          name="confirmPassword"
                          placeHolder="Confirm Password"
                          onChange={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          value={values.confirmPassword}
                        />
                        {errors.confirmPassword && (
                          <small className="text-danger">
                            {errors.confirmPassword}
                          </small>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                          disabled={showSpinner}
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
                            "Reset Password"
                          )}
                        </button>
                        <hr />
                        <NavLink
                          style={{ textDecoration: "none" }}
                          className="btn btn-primary btn-user btn-block"
                          to="/"
                        >
                          Back To Login!
                        </NavLink>
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
  );
}

export default ResetPassword;
