import React, { useEffect, useState, useCallback } from "react";
import editIcon from "../../assets/images/edit_icon.png";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
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
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  const provinces = [
    { value: "AB", label: "Alberta (AB)" },
    { value: "BC", label: "British Columbia (BC)" },
    { value: "MB", label: "Manitoba (MB)" },
    { value: "NB", label: "New Brunswick (NB)" },
    { value: "NL", label: "Newfoundland and Labrador (NL)" },
    { value: "NS", label: "Nova Scotia (NS)" },
    { value: "NT", label: "Northwest Territories (NT)" },
    { value: "NU", label: "Nunavut (NU)" },
    { value: "ON", label: "Ontario (ON)" },
    { value: "PE", label: "Prince Edward Island (PE)" },
    { value: "QC", label: "Quebec (QC)" },
    { value: "SK", label: "Saskatchewan (SK)" },
    { value: "YT", label: "Yukon (YT)" }
  ];

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
      fertilityScreening: false,
      fertilityScreeningDelivery: "",
      ongoingFertilityCare: false,
      ongoingFertilityCareDelivery: "",
      pregnancyCare: false,
      pregnancyCareDelivery: ""
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
      console.log('API Response:', response);

      // Check if response is nested in an obj property
      const userData = response?.obj || response;

      setFieldValue("firstName", userData?.firstname || "");
      setFieldValue("lastName", userData?.lastName || "");
      setFieldValue("email", userData?.email || "");
      setFieldValue("address", userData?.address || "");
      setFieldValue("phoneNumber", userData?.phoneNumber || "");
      setFieldValue("picture", userData?.picture || "");
      setFieldValue("DOB", userData?.dob || "");
      setFieldValue("practiceLocation", userData?.practiceLocation || "");
      setFieldValue("fertilityScreening", userData?.fertilityScreening || false);
      setFieldValue("fertilityScreeningDelivery", userData?.fertilityScreeningDelivery || "");
      setFieldValue("ongoingFertilityCare", userData?.ongoingFertilityCare || false);
      setFieldValue("ongoingFertilityCareDelivery", userData?.ongoingFertilityCareDelivery || "");
      setFieldValue("pregnancyCare", userData?.pregnancyCare || false);
      setFieldValue("pregnancyCareDelivery", userData?.pregnancyCareDelivery || "");

      // If there's an existing profile image URL, set it
      setUploadedFileUrl(userData?.profile || null);
    } catch (error) {
      console.error('Profile fetch error:', error);
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
                <div className="position-relative d-inline-block">
                  <img
                    src={uploadedFileUrl}
                    className="rounded-circle"
                    width={200}
                    height={200}
                    alt="Uploaded"
                  />
                  <Upload {...uploadProps} showUploadList={false}>
                    <img
                      src={editIcon}
                      alt="edit"
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "30px",
                        cursor: "pointer",
                      }}
                    />
                  </Upload>
                </div>
              ) : (
                <div className="position-relative d-inline-block">
                  {values.picture ? (
                    <Avatar
                      shape="circle"
                      size={200}
                      icon={<img
                        src={values.picture}
                        alt="edit"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />}
                    />
                  ) : (
                    <Avatar
                      shape="circle"
                      size={200}
                      icon={<UserAddOutlined style={{ fontSize: '80px' }} />}
                    />
                  )}
                  <Upload {...uploadProps} showUploadList={false}>
                    <img
                      src={editIcon}
                      alt="edit"
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "30px",
                        cursor: "pointer",
                      }}
                    />
                  </Upload>
                </div>
              )}
              {values.firstName && values.lastName && (
                <h4 className="mt-3 mb-0">
                  {values.firstName} {values.lastName}
                </h4>
              )}
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
                <div className="col-md-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        className="form-control"
                        name="address"
                        type="text"
                        value={values.address === "undefined undefined undefined undefined undefined" ? "" : values.address}
                        onChange={handleChange("address")}
                        onBlur={handleBlur("address")}
                      />
                    </div>
                  </div>
              </div>
              {userAuth?.obj?.role !== "Patient" && (
                <div className="row">
                 
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Practice Location</label>
                      <select
                        className="form-control"
                        name="practiceLocation"
                        value={values.practiceLocation}
                        onChange={handleChange("practiceLocation")}
                        onBlur={handleBlur("practiceLocation")}
                      >
                        <option value="">Select Province</option>
                        {provinces.map((province) => (
                          <option key={province.value} value={province.value}>
                            {province.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="required">Care Types</label>
                      <style>
                        {`
                                .form-check-input:focus {
                                  outline: none;
                                  box-shadow: none;
                                }
                              `}
                      </style>
                      <div>
                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="fertilityScreening"
                              checked={values.fertilityScreening}
                              onChange={(e) => setFieldValue("fertilityScreening", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="fertilityScreening">
                              Fertility Screening
                            </label>
                          </div>
                          {values.fertilityScreening && (
                            <div className="mt-2 ml-4">
                              <label className="required">Delivery Type</label>
                              <select
                                className="form-control"
                                name="fertilityScreeningDelivery"
                                value={values.fertilityScreeningDelivery}
                                onChange={handleChange("fertilityScreeningDelivery")}
                                onBlur={handleBlur("fertilityScreeningDelivery")}
                              >
                                <option value="">Select Delivery Type</option>
                                <option value="virtual">Virtual</option>
                                <option value="in-person">In-Person</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="ongoingFertilityCare"
                              checked={values.ongoingFertilityCare}
                              onChange={(e) => setFieldValue("ongoingFertilityCare", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="ongoingFertilityCare">
                              Ongoing Fertility Care
                            </label>
                          </div>
                          {values.ongoingFertilityCare && (
                            <div className="mt-2 ml-4">
                              <label className="required">Delivery Type</label>
                              <select
                                className="form-control"
                                name="ongoingFertilityCareDelivery"
                                value={values.ongoingFertilityCareDelivery}
                                onChange={handleChange("ongoingFertilityCareDelivery")}
                                onBlur={handleBlur("ongoingFertilityCareDelivery")}
                              >
                                <option value="">Select Delivery Type</option>
                                <option value="virtual">Virtual</option>
                                <option value="in-person">In-Person</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          )}
                        </div>

                        <div className="mb-3">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="pregnancyCare"
                              checked={values.pregnancyCare}
                              onChange={(e) => setFieldValue("pregnancyCare", e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="pregnancyCare">
                              Pregnancy Care
                            </label>
                          </div>
                          {values.pregnancyCare && (
                            <div className="mt-2 ml-4">
                              <label className="required">Delivery Type</label>
                              <select
                                className="form-control"
                                name="pregnancyCareDelivery"
                                value={values.pregnancyCareDelivery}
                                onChange={handleChange("pregnancyCareDelivery")}
                                onBlur={handleBlur("pregnancyCareDelivery")}
                              >
                                <option value="">Select Delivery Type</option>
                                <option value="virtual">Virtual</option>
                                <option value="in-person">In-Person</option>
                                <option value="both">Both</option>
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12"></div>
                </div>
              )}
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
