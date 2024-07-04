import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

// pages

import Dashboard from "../global_component/DashBoard";
import NotFound from "../ErrorPages/NotFound";

//#region layouts
import RootLayout from "../layouts/rootLayout";
import AuthLayout from "../layouts/AuthLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import UnderDevelopment from "../ErrorPages/UnderDevelopment";
//#endregion

//#region Auth
import Login from "../Login/Login";
import Register from "../Register/Register";
import AdminLogin from "../Login/AdminLogin";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import ResetPassword from "../ForgotPassword/ResetPassword";

import Profile from "../ManageProfile/UpdateProfile";
import Password from "../ManageProfile/UpdatePassword";
//#endregion

//#region Manage User
//#endregion

//#region  Manage Assessments
//#endregion

//#region Manange Medication
import Medication from "../ManageMedication/Medication";
//#endregion

//#region Manange Appointment
import Appointment from "../ManageAppointment/Appointment";
//#endregion

//#region Manange Learn
import Learn from "../ManageLearn/Learn";
//#endregion

//#region Manange SubscriptionPlan
import SubscriptionPlan from "../Register/SubscriptionPlan";
import SubscriptionSuccessPage from "../Register/StepFormSubscription/SubscriptionSuccessPage";
//#endregion

//#region Manage Preview Links
import PreviewLink from "../ManagePreviewLink/PreviewLinkList";
//#endregion

const getRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="/reset-password/:id?" element={<ResetPassword />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route element={<RootLayout />}>
          <Route path="home" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="update-password" element={<Password />} />
          #region Medication
          <Route path="medication" element={<Medication />} />
          #endregion #region Appointment
          <Route path="appointment" element={<Appointment />} />
          #endregion #region Learn
          <Route path="learn" element={<Learn />} />
          #endregion #region subscription-plan
          <Route path="preview-link" element={<PreviewLink />} />
          #endregion
          <Route path="not-found" element={<NotFound />} />
          {/* if user enter route which is does not exist then this below route page will be called by default */}
        </Route>
        {/* only for patient */}
        <Route path="subscription-plan" element={<SubscriptionPlan />} />
      </Route>
      <Route
        path="/subscription-plan-succeeded/:paymentTimeTicks"
        element={<SubscriptionSuccessPage />}
      />
      {/* <Route path="*" element={<NotFound />} /> */}
      <Route path="*" element={<UnderDevelopment />} />
    </>
  )
);

function RouteComp() {
  return (
    <main>
      <RouterProvider router={getRouter} />
    </main>
  );
}

export default RouteComp;
