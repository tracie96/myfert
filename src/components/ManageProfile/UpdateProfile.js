import React, { useEffect, useState, useCallback } from "react";
import userIcon from "../../assets/images/users/user1.jpg";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getLoggedInUser,
  updateProfile,
  updateProfileImage,
} from "../redux/AuthController";
import { useFormik } from "formik";
import * as Yup from "yup";
import Map from "./Map";


const UpdateProfile = () => {
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleteDisabled, setIsDeleteDisabled] = useState(false);
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false);

  const initialValues = {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    DOB: "",
    phoneNumber: "",
    address: "",
    gender: "",
    profile: "",
    availabilityFrom: "",
    availabilityTo: "",
    latitude: 53.520611,
    longitude: -113.4627,
  };

  const validateUpdateProfile = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "First Name must be at least 3 characters")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(3, "Last Name must be at least 3 characters")
      .required("Last Name is required"),
    email: Yup.string().required("Email is required"),
    address: Yup.string()
      .min(8, "Address must be at least 8 characters")
      .required("Address is required"),
    phoneNumber: Yup.string()
      .min(8, "Phone Number must be at least 8 characters")
      .required("Phone Number is required"),
    DOB: Yup.date()
      .required("Please select your date of birth")
      .max(
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        "You must be 18 years or older"
      ),
    gender: Yup.string().required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validateUpdateProfile,
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        const action = dispatch(updateProfile(values));
        const resultAction = await action;
        console.log(resultAction);
      } catch (error) {
        console.error(error);
      } finally {
        setShowSpinner(false);
      }
    },
  });

  const { setFieldValue, values, handleBlur, handleChange, handleSubmit, errors } = formik;

  const handleImageChange = (e) => {
    const image = e.target.files[0];
    if (image && image.size <= 2 * 1024 * 1024) {
      setSelectedImage(image);
      setIsUpdateDisabled(false);
    } else {
      toast.warning("Image must be less than 2 MB.");
      e.target.value = null; // Clear the file input
    }
  };

  const handleDeleteAndUpdateImage = async (action) => {
    setIsUpdateDisabled(true);
    setIsDeleteDisabled(true);
    setIsUploading(true);
    const formData = {
      Id: loggedInUser.id,
      file: selectedImage,
    };

    if (action === "deleted") {
      formData.isDeleted = true;
    }
    try {
      const response = await dispatch(updateProfileImage(formData));
      if (response?.payload) {
        setFieldValue("profile", response?.payload?.profile);
      }
    } catch (error) {
      toast.error("Failed to update image");
    } finally {
      setIsUpdateDisabled(false);
      setIsDeleteDisabled(false);
      setIsUploading(false);
    }
  };

  const handleDeleteImage = () => {
    handleDeleteAndUpdateImage("deleted");
  };

  const handleUpdateImage = () => {
    handleDeleteAndUpdateImage("updated");
  };

  const handleDispatch = useCallback(
    async (action) => {
      try {
        const resultAction = await dispatch(action);
        const response = resultAction.payload;

        setFieldValue("id", response.id || "");
        setFieldValue("firstName", response.firstName || "");
        setFieldValue("lastName", response.lastName || "");
        setFieldValue("email", response.email || "");
        setFieldValue("address", response.address || "");
        setFieldValue("phoneNumber", response.phoneNumber || "");
        setFieldValue("DOB", response.dob || "");
        setFieldValue("gender", response.gender || "");
        setFieldValue("profile", response.profile || "");
        setFieldValue("latitude", response.latitude || 53.520611);
        setFieldValue("longitude", response.longitude || -113.4627);
        setFieldValue("availabilityFrom", response.availabilityFrom || "");
        setFieldValue("availabilityTo", response.availabilityTo || "");

        setIsDeleteDisabled(response.profile == null || !response.profile);
      } catch (error) {
        console.error(error);
      }
    },
    [dispatch, setFieldValue]
  );

  useEffect(() => {
    if (loggedInUser.id) {
      handleDispatch(getLoggedInUser(loggedInUser.id));
    }
  }, [loggedInUser.id, handleDispatch]);
  return (
    <>
      <div className="row px-5 pb-5">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <div className="text-center mt-4">
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    className="rounded-circle"
                    width={210}
                    height={170}
                    alt="Selected"
                  />
                ) : (
                  <img
                    src={values.profile ? values.profile : userIcon}
                    className="rounded-circle"
                    width={210}
                    height={170}
                    alt="user-profile"
                  />
                )}
                <div className="my-3 d-md-flex justify-content-md-center">
                  <input
                    className="form-control w-75"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="mt-3 gap-2 d-md-flex justify-content-md-center">
                <button
                  type="button"
                  className="btn-sm btn-danger"
                  onClick={handleDeleteImage}
                  disabled={isDeleteDisabled || isUploading}
                >
                  Delete Image
                </button>

                <button
                  className="btn-sm btn-primary"
                  type="submit"
                  onClick={handleUpdateImage}
                  disabled={isUpdateDisabled || isUploading || !selectedImage}
                >
                  Update Image
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* map section */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <Map
                    latitude={values.latitude}
                    longitude={values.longitude}
                    setFieldValue={setFieldValue}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-12 mt-4">
          <div className="card">
            <div className="card-body">
              <form className="" method="put" onSubmit={handleSubmit}>
                <input
                  className="form-control"
                  type="hidden"
                  value={values.id}
                />
                <div className="row">
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
                        <small className="text-danger">
                          {errors.firstName}
                        </small>
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

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        className="form-control"
                        name="email"
                        type="email"
                        autoComplete="on"
                        value={values.email}
                        onChange={handleChange("email")}
                        onBlur={handleBlur("email")}
                      />
                      {errors.email && (
                        <small className="text-danger">{errors.email}</small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        className="form-control"
                        name="DOB"
                        type="date"
                        autoComplete="off"
                        value={values.DOB}
                        onChange={handleChange("DOB")}
                      />
                      {errors.DOB && (
                        <small className="text-danger">{errors.DOB}</small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        className="form-control"
                        name="phoneNumber"
                        type="text"
                        autoComplete="off"
                        value={values.phoneNumber}
                        onChange={handleChange("phoneNumber")}
                        onBlur={handleBlur("phoneNumber")}
                      />
                      {errors.phoneNumber && (
                        <small className="text-danger">
                          {errors.phoneNumber}
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label>Gender: </label>
                    <div className="form-group" tag="fieldset">
                      <div
                        className="form-group form-check-inline"
                        check
                        inline
                      >
                        <label check>
                          <input
                            className=""
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={values.gender === "Male"}
                            onChange={handleChange("gender")}
                          />{" "}
                          Male
                        </label>
                      </div>
                      <div className="form-group form-check-inline">
                        <label check>
                          <input
                            className=""
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={values.gender === "Female"}
                            onChange={handleChange("gender")}
                          />
                          Female
                        </label>
                      </div>
                    </div>
                    {errors.gender && (
                      <small className="text-danger">{errors.gender}</small>
                    )}
                  </div>

                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        className="form-control"
                        name="address"
                        type="text"
                        autoComplete="off"
                        value={values.address}
                        onChange={handleChange("address")}
                        onBlur={handleBlur("address")}
                      />
                      {errors.address && (
                        <small className="text-danger">{errors.address}</small>
                      )}
                    </div>
                  </div>
                </div>

                {/* <div className="row mt-3">
                  <label>Avalaibility</label>
                  <div className="col-md-5">
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="availabilityFrom"
                        type="time"
                        autoComplete="off"
                        value={values.availabilityFrom}
                        onChange={handleChange("availabilityFrom")}
                        onBlur={handleBlur("availabilityFrom")}
                      />
                      {errors.availabilityFrom && (
                        <small className="text-danger">
                          {errors.availabilityFrom}
                        </small>
                      )}
                    </div>
                  </div>
                  <div className="col-md-2 text-center">
                    <span className="text-primary"> - From - </span>
                  </div>
                  <div className="col-md-5">
                    <div className="form-group">
                      <input
                        className="form-control"
                        name="availabilityTo"
                        type="time"
                        autoComplete="off"
                        value={values.availabilityTo}
                        onChange={handleChange("availabilityTo")}
                        onBlur={handleBlur("availabilityTo")}
                      />
                      {errors.availabilityTo && (
                        <small className="text-danger">
                          {errors.availabilityTo}
                        </small>
                      )}
                    </div>
                  </div>
                </div> */}

                <div className="row">
                  <div className="text-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
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
      </div>
    </>
  );
};

export default UpdateProfile;
