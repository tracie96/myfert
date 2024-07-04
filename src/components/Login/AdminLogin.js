import {  Navigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { postLogin } from "../redux/AuthController";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";

const initialValues = {
  email: "",
  password: "",
};

const validateLogin = Yup.object().shape({
  email: Yup.string()
    // .email("Please enter valid email")
    .matches(
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/,
      "Please enter a valid email"
    )
    .required("Please enter email"),
  password: Yup.string().min(3).required("Please enter password"),
});

function AdminLogin() {
  const [showSpinner, setSpinner] = useState(false);
  console.log(showSpinner)
  const dispatch = useDispatch();
  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateLogin,
    onSubmit: (values) => {
      console.log(values);
      try {
        dispatch(postLogin(values));
        setSpinner(true);
      } catch (error) {
        console.log("login-page api call error: " + error);
      }
    },
  });

  const data = useSelector((state) => state?.authentication?.userAuth);

  const { loading } = useSelector((state) => state?.authentication);

  if (data) {
    return <Navigate to="/home" />;
  }

  return (
    //style={{ height: "534px" }}
    <div className="bg-gradient-primary">
      <div className="container py-5" style={{ minHeight: "100vh" }}>
        {/* Outer Row */}
        <div className="row justify-content-center mt-5">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg">
              <div className="card-body p-0">
                {/* Nested Row within Card Body */}
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image-admin"></div>
                  <div className="col-lg-6 pt-lg-5 mt-lg-3">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
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
                        <div className="form-group">
                          <input
                            type="password"
                            className="form-control form-control-user"
                            id="exampleInputPassword"
                            placeholder="Password"
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
                        {/* <div className="form-group">
                          <div className="custom-control custom-checkbox small">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              id="customCheck"
                            />
                            <label
                              className="custom-control-label"
                              htmlFor="customCheck"
                            >
                              Remember Me
                            </label>
                          </div>
                        </div> */}
                        <button
                          type="submit"
                          className="btn btn-primary btn-user btn-block"
                          disabled={loading}
                        >
                          {loading ? (
                            <span>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              {/* Loading... */}
                            </span>
                          ) : (
                            <span>Login</span>
                          )}
                        </button>
                        {/* <hr />
                        <button className="btn btn-primary btn-user btn-block">
                          <i className="fab fa-google fa-fw"></i> Login with
                          Google
                        </button>
                        <button className="btn btn-primary btn-user btn-block">
                          <i className="fab fa-facebook-f fa-fw"></i> Login with
                          Facebook
                        </button> */}
                      </form>
                      {/* <hr />
                      <div className="text-center">
                        <NavLink className="small" to="/forgot-password">
                          Forgot Password?
                        </NavLink>
                      </div> */}
                      {/* <div className="text-center">
                        <NavLink className="small" to="/register">
                          Create an Account!
                        </NavLink>
                      </div> */}
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

export default AdminLogin;
