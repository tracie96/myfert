import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import PatientDashboard from "../ManageDashboard/PatientDashboard";
import DoctorDashboard from "../ManageDashboard/DoctorDashboard";
import { useNavigate } from "react-router";
import AdminDashboard from "../ManageDashboard/AdminDashboard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userAuth } = useSelector((state) => state.authentication);
  const [showSpinner, setShowSpinner] = useState(true);
  const [dashboardDetailDto, setDashboardDetailDto] = useState([]);

  useEffect(() => {
    // fetchDashboardGraphData();
  }, []);

  return (
    <>
      {userAuth?.role === "SuperAdmin" && <AdminDashboard />}
      {(userAuth?.role === "Coach" || userAuth?.role === "Doctor") && (
        <DoctorDashboard />
      )}
      {userAuth?.role === "Patient" && <PatientDashboard />}
    </>
  );
};
export default Dashboard;
