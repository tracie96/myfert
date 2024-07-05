import { useEffect } from "react";
import { useSelector } from "react-redux";
import PatientDashboard from "../ManageDashboard/PatientDashboard";
import DoctorDashboard from "../ManageDashboard/DoctorDashboard";
import AdminDashboard from "../ManageDashboard/AdminDashboard";

const Dashboard = () => {
  const { userAuth } = useSelector((state) => state.authentication);


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
