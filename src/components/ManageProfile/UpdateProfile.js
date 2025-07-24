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
import './UpdateProfile.css';

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
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
    partnerDob: Yup.date().nullable(),
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
      picture: "",
      availabilityFrom: "",
      availabilityTo: "",
      latitude: 53.520611,
      longitude: -113.4627,
      fertilityScreening: false,
      fertilityScreeningDelivery: "",
      ongoingFertilityCare: false,
      ongoingFertilityCareDelivery: "",
      pregnancyCare: false,
      pregnancyCareDelivery: "",
      pharmacyName: "",
      pharmacyAddress: "",
      pharmacyPhoneNumber: "",
      uli:"",
      pharmacyFaxNumber: "",
      // Add partner fields
      partnerFirstname: "",
      partnerLastname: "",
      partnerGender: "",
      partnerPronouns: "",
      partnerDob: "",
    },
    validationSchema: validateUpdateProfile,
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        const updatedValues = { ...values, profile: uploadedFileUrl };
        dispatch(updateProfileUser(updatedValues));
        const action = dispatch(updateProfile(updatedValues));
        const resultAction = await action;
        console.log(resultAction);
        
        // Show success message
        message.success('Profile updated successfully!');
      } catch (error) {
        console.error(error);
        // Show error message
        message.error('Failed to update profile. Please try again.');
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
      
      // Set pharmacy values
      setFieldValue("pharmacyName", userData?.pharmacyName || "");
      setFieldValue("pharmacyAddress", userData?.pharmacyAddress || "");
      setFieldValue("pharmacyPhoneNumber", userData?.pharmacyPhoneNumber || "");
      setFieldValue("pharmacyFaxNumber", userData?.pharmacyFaxNumber || "");

      // Set partner values
      setFieldValue("partnerFirstname", userData?.partnerFirstname || "");
      setFieldValue("partnerLastname", userData?.partnerLastname || "");
      setFieldValue("partnerGender", userData?.partnerGender || "");
      setFieldValue("partnerPronouns", userData?.partnerPronouns || "");
      setFieldValue("partnerDob", userData?.partnerDob || "");
      setFieldValue("uli", userData?.uli || "");


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
      
        const originalName = info.file.originFileObj?.name || info.file.name;
        const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
      
        message.success(`${nameWithoutExtension} file uploaded successfully!`);
      } else if (status === "error") {
        const originalName = info.file.originFileObj?.name || info.file.name;
        const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, '');
      
        message.error(`${nameWithoutExtension} file upload failed.`);
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
              {/* {values.firstName && values.lastName && (
                <h4 className="mt-3 mb-0">
                  {values.firstName} {values.lastName}
                </h4>
              )} */}
              <div className="vertical-tabs mt-4">
                <div 
                  className={`tab-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </div>
                {userAuth?.obj?.role === "Patient" && (
                  <>
                    <div 
                      className={`tab-item ${activeTab === 'partner' ? 'active' : ''}`}
                      onClick={() => setActiveTab('partner')}
                    >
                      Partner
                    </div>
                    <div 
                      className={`tab-item ${activeTab === 'pharmacy' ? 'active' : ''}`}
                      onClick={() => setActiveTab('pharmacy')}
                    >
                      Pharmacy
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            {activeTab === 'profile' ? (
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
                          value={ values.address}
                          onChange={handleChange("address")}
                          onBlur={handleBlur("address")}
                        />
                      </div>
                    </div>
                    {userAuth?.obj?.role === "Patient" && (
                    <div className="col-md-12">
                    <div className="form-group">
                      <label>ULI Number</label>
                      <input
                        className="form-control"
                        name="uli"
                        type="text"
                        value={ values.uli}
                        onChange={handleChange("uli")}
                        onBlur={handleBlur("uli")}
                      />
                    </div>
                  </div>
                )}
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
            ) : activeTab === 'partner' && userAuth?.obj?.role === "Patient" ? (
              <div className="partner-form mt-3">
                <div className="row" style={{ color: "#000" }}>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Partner's First Name</label>
                      <input
                        className="form-control"
                        name="partnerFirstname"
                        type="text"
                        value={values.partnerFirstname}
                        onChange={handleChange("partnerFirstname")}
                        onBlur={handleBlur("partnerFirstname")}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Partner's Last Name</label>
                      <input
                        className="form-control"
                        name="partnerLastname"
                        type="text"
                        value={values.partnerLastname}
                        onChange={handleChange("partnerLastname")}
                        onBlur={handleBlur("partnerLastname")}
                      />
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Partner's Gender</label>
                      <select
                        className="form-control"
                        name="partnerGender"
                        value={values.partnerGender}
                        onChange={handleChange("partnerGender")}
                        onBlur={handleBlur("partnerGender")}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Partner's Pronouns</label>
                      <select
                        className="form-control"
                        name="partnerPronouns"
                        value={values.partnerPronouns}
                        onChange={handleChange("partnerPronouns")}
                        onBlur={handleBlur("partnerPronouns")}
                      >
                        <option value="">Select Pronouns</option>
                        <option value="He/Him">He/Him</option>
                        <option value="She/Her">She/Her</option>
                        <option value="They/Them">They/Them</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Partner's Date of Birth</label>
                      <input
                        className="form-control"
                        name="partnerDob"
                        type="date"
                        value={values.partnerDob}
                        onChange={handleChange("partnerDob")}
                        onBlur={handleBlur("partnerDob")}
                      />
                    </div>
                  </div>

                  <div className="text-end mt-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ background: "#00ADEF", border: 0, color: "#fff" }}
                      onClick={handleSubmit}
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
              </div>
            ) : activeTab === 'pharmacy' && userAuth?.obj?.role === "Patient" ? (
              <div className="pharmacy-form mt-3">
                <div className="row" style={{ color: "#000" }}>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Pharmacy Name</label>
                      <input
                        className="form-control"
                        name="pharmacyName"
                        type="text"
                        value={values.pharmacyName}
                        onChange={handleChange("pharmacyName")}
                        onBlur={handleBlur("pharmacyName")}
                        placeholder="Enter pharmacy name"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        className="form-control"
                        name="pharmacyAddress"
                        type="text"
                        value={values.pharmacyAddress}
                        onChange={handleChange("pharmacyAddress")}
                        onBlur={handleBlur("pharmacyAddress")}
                        placeholder="Enter pharmacy address"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <ReactInputMask
                        mask="+1 (999) 999-9999"
                        maskChar={null}
                        value={values.pharmacyPhoneNumber}
                        onChange={handleChange("pharmacyPhoneNumber")}
                        onBlur={handleBlur("pharmacyPhoneNumber")}
                      >
                        {(inputProps) => (
                          <input
                            {...inputProps}
                            className="form-control"
                            name="pharmacyPhoneNumber"
                            type="text"
                            placeholder="Enter pharmacy phone number"
                            autoComplete="off"
                          />
                        )}
                      </ReactInputMask>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Fax Number</label>
                      <ReactInputMask
                        mask="+1 (999) 999-9999"
                        maskChar={null}
                        value={values.pharmacyFaxNumber}
                        onChange={handleChange("pharmacyFaxNumber")}
                        onBlur={handleBlur("pharmacyFaxNumber")}
                      >
                        {(inputProps) => (
                          <input
                            {...inputProps}
                            className="form-control"
                            name="pharmacyFaxNumber"
                            type="text"
                            placeholder="Enter pharmacy fax number"
                            autoComplete="off"
                          />
                        )}
                      </ReactInputMask>
                    </div>
                  </div>
                  <div className="text-end mt-3">
                    <button
                      type="button"
                      className="btn btn-primary"
                      style={{ background: "#00ADEF", border: 0, color: "#fff" }}
                      onClick={handleSubmit}
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
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProfile;
