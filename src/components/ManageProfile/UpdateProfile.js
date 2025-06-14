import React, { useEffect, useState, useCallback } from "react";
import editIcon from "../../assets/images/edit_icon.png";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMediaQuery } from "react-responsive";
import { Avatar, Upload, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import ReactInputMask from "react-input-mask";
import { Spin } from "antd";
import { getUserProfile, updateProfile } from "../redux/AuthController";
import { updateProfileUser } from '../redux/profileSlice';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const validateUpdateProfile = Yup.object().shape({
    email: Yup.string(),
    phoneNumber: Yup.string().min(
      8,
      "Phone Number must be at least 8 characters"
    ),
    DOB: Yup.date().max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "You must be 18 years or older"
    ),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      DOB: "",
      picture: "", // Changed to store URL from Cloudinary
      availabilityFrom: "",
      availabilityTo: "",
      latitude: 53.520611,
      longitude: -113.4627,
    },
    validationSchema: validateUpdateProfile,
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        // Include the Cloudinary URL in the values to be submitted
        const updatedValues = { ...values, profile: uploadedFileUrl };
        dispatch(updateProfileUser(updatedValues));
        const action = dispatch(updateProfile(updatedValues));
        const resultAction = await action;
        console.log(resultAction);
      } catch (error) {
        console.error(error);
      } finally {
        setShowSpinner(false);
      }
    },
  });

  const {
    setFieldValue,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
  } = formik;

  const handleDispatch = useCallback(async () => {
    setLoading(true);
    try {
      const resultAction = await dispatch(getUserProfile());
      const response = resultAction.payload;

      setFieldValue("firstName", response.firstname || "");
      setFieldValue("lastName", response.lastName || "");
      setFieldValue("email", response.email || "");
      setFieldValue("address", response.address || "");
      setFieldValue("phoneNumber", response.phoneNumber || "");
      setFieldValue("picture", response.picture || "");
      setFieldValue("DOB", response.dob || "");

      // If there's an existing profile image URL, set it
      setUploadedFileUrl(response.profile || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, setFieldValue]);

  useEffect(() => {
    handleDispatch();
  }, [handleDispatch]);

  const uploadProps = {
    name: "file",
    multiple: false,
    action: "https://api.cloudinary.com/v1_1/tracysoft/upload",
    data: {
      upload_preset: "myfertility",
    },
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        const url = info.file.response.secure_url;
        setUploadedFileUrl(url);
        setFieldValue("picture", url);
        message.success(`${info.file.name} file uploaded successfully!`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin
          as="span"
          animation="border"
          size="large"
          role="status"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <>
      <div className="row pb-5" style={{ width: isMobile ? "100%" : "75%" }}>
        <h2
          style={{
            textAlign: "center",
            color: "#00ADEF",
            padding: 20,
            fontWeight: "bold",
          }}
        >
          Profile
        </h2>
        <div className="col-md-4">
          <div className="card-body">
            <div className="text-center mt-4">
              {uploadedFileUrl ? (
                <div>
                  <img
                    src={uploadedFileUrl}
                    className="rounded-circle"
                    width={200}
                    height={200}
                    alt="Uploaded"
                  />
                </div>
              ) : (
                <div>
                  {values.picture && ( <Avatar
                      shape="circle"
                      size={200}
                      icon={<img
                        src={values.picture}
                        alt="edit"
                        style={{
                          cursor: "pointer",
                        }}
                      />}
                    />)}
                  {!values.picture &&
                    <Avatar
                      shape="circle"
                      size={200}
                      icon={<UserAddOutlined />}
                    />}

                </div>
              )}
              <Upload {...uploadProps} showUploadList={false}>
                <img
                  src={editIcon}
                  alt="edit"
                  style={{
                    position: "absolute",
                    top: isMobile ? "55%" : "55%",
                    left: "63%",
                    width: isMobile ? "15%" : "12%",
                    cursor: "pointer",
                  }}
                />
              </Upload>
              {values.picture ? ' ' : <div className="my-3 d-md-flex justify-content-md-center">
                {values.firstName} {values.lastName}
              </div>}
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <form className="" method="put" onSubmit={handleSubmit}>
              <div className="row" style={{ color: "#000" }}>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      className="form-control"
                      name="firstName"
                      type="firstName"
                      autoComplete="on"
                      value={values.firstName}
                      onChange={handleChange("firstName")}
                      onBlur={handleBlur("firstName")}
                    />
                    {errors.firstName && (
                      <small className="text-danger">{errors.firstName}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      className="form-control"
                      name="lastName"
                      type="lastName"
                      autoComplete="on"
                      value={values.lastName}
                      onChange={handleChange("lastName")}
                      onBlur={handleBlur("lastName")}
                    />
                    {errors.lastName && (
                      <small className="text-danger">{errors.lastName}</small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      name="email"
                      type="email"
                      autoComplete="on"
                      value={values.email}
                      readOnly
                      onBlur={handleBlur("email")}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <ReactInputMask
                      mask="+1 (999) 999-9999"
                      maskChar={null}
                      value={values.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                      onBlur={handleBlur("phoneNumber")}
                    >
                      {(inputProps) => (
                        <input
                          {...inputProps}
                          className="form-control"
                          name="phoneNumber"
                          type="text"
                          autoComplete="off"
                        />
                      )}
                    </ReactInputMask>
                    {errors.phoneNumber && (
                      <small className="text-danger">
                        {errors.phoneNumber}
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      className="form-control"
                      name="DOB"
                      type="date"
                      value={values.DOB}
                      onChange={handleChange("DOB")}
                      onBlur={handleBlur("DOB")}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                    />
                    {errors.DOB && (
                      <small className="text-danger">{errors.DOB}</small>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ background: "#00ADEF", border: 0, color: "#fff" }}
                    disabled={showSpinner}
                  >
                    {showSpinner && (
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    )}
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
