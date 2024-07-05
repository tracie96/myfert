import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "react-bootstrap/Spinner";
import * as Yup from "yup";
import { useEffect, useState,useCallback } from "react";
import { userListDropdown } from "../redux/adminSlice";
import { useNavigate } from "react-router";

function UserDropdown(onSuccessModal) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showUserSpinner, setShowUserSpinner] = useState(false);
  const [userData, setUserData] = useState([]);
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);

  const fetchUsersList = useCallback(async () => {
    setShowUserSpinner(true);
    try {
      const response = await dispatch(userListDropdown());

      if (userListDropdown.fulfilled.match(response)) {
        setUserData(response?.payload);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setShowUserSpinner(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (loggedInUser?.role) {
      fetchUsersList();
    }
  }, [loggedInUser?.role, fetchUsersList]);
  const initialValues = {
    userId: "",
    tabId: "",
  };

  const validateDownloadDocument = Yup.object().shape({
    userId: Yup.string().required("Please select a user"),
  });

  const { values, handleBlur, handleChange, handleSubmit, errors } = useFormik({
    initialValues: initialValues,
    validationSchema: validateDownloadDocument,
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        // navigate to other page with user id and tabId
        values.tabId = "document-List";
        // navigate(`/view-profile/${values.userId}/${TabId}`);
        // navigate(`/view-profile`, { state: values });
        // onSuccessModal(false);
        navigate(`/view-profile`, { state: values }).then(() => {
          onSuccessModal(false);
        });
      } catch (error) {
      } finally {
        setShowSpinner(false);
      }
    },
  });

  return (
    <>
      <form className="documentDownload" onSubmit={handleSubmit}>
        <div className="form-group col-lg-12">
          <label
            className="form-label ml-1 fw-bold"
            htmlFor="exampleInputSUser"
          >
            Select User
            {showUserSpinner && (
              <span>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              </span>
            )}
          </label>
          <select
            className="form-control"
            id="exampleInputSUser"
            value={values.userId}
            onBlur={handleBlur("userId")}
            onChange={handleChange("userId")}
          >
            <option selected="true" disabled="true" value="">
              Select User
            </option>
            {userData &&
              userData.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
          {errors.userId && (
            <small className="text-danger">{errors.userId}</small>
          )}
        </div>
        <div className="col-md-12">
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
              "Proceed"
            )}
          </button>
        </div>
      </form>
    </>
  );
}

export default UserDropdown;
