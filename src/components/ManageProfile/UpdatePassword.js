import React, { useState } from "react";
import PasswordInput from "../global_component/PasswordInput";
import { useFormik } from "formik";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../redux/AuthController";
const UpdatePassword = () => {
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: loggedInUser.id,
      oldPassword: "",
      newpassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old Password is required"),
      newpassword: Yup.string().required("Password is required"),
      confirmPassword: Yup.string().required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        const response = await dispatch(updatePassword(values));
        if (response) {
          setShowSpinner(false);
        }
      } catch (error) {
      } finally {
      }
    },
  });
  const isPasswordMatch =
    formik.values.newpassword === formik.values.confirmPassword;
  const updateButtonDisabled = !isPasswordMatch;
  const passwordMismatchMessage = !isPasswordMatch && (
    <div className="text-danger text-end">
      Password & Confirm Password do not match!
    </div>
  );
  return (
    <>
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-12 col-md-9">
          <div className="card o-hidden border-0 shadow-lg my-3">
            <div className="card-body p-0">
              {/* Nested Row within Card Body */}
              <div className="row">
                <div className="col-lg-12">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h3 text-gray-900 mb-4">Update Password</h1>
                    </div>
                    <form method="post" onSubmit={formik.handleSubmit}>
                      <input type="hidden" name="id" value={loggedInUser.id} />
                      <PasswordInput
                        label="Old Password"
                        name="oldPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.oldPassword}
                      />
                      <PasswordInput
                        label="New Password"
                        name="newpassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.newpassword}
                      />
                      <PasswordInput
                        label="Confirm Password"
                        name="confirmPassword"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.confirmPassword}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-user btn-block"
                        disabled={showSpinner || updateButtonDisabled}
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
                          "Update Password"
                        )}
                      </button>
                      {passwordMismatchMessage}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UpdatePassword;
