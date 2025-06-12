import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from "react-router-dom";
import { useSelector } from "react-redux";

// pages

import NotFound from "../ErrorPages/NotFound";

//#region layouts
import AuthLayout from "../layouts/AuthLayout";
import UnderDevelopment from "../ErrorPages/UnderDevelopment";
//#endregion

//#region Auth
import Login from "../Login/Login";
import Register from "../Register/Register";
import PatientSignup from "../Register/SignUpPages/PatientSignup";
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
//#endregion

//#region Manange SubscriptionPlan
import SubscriptionPlan from "../Register/SubscriptionPlan";
import SubscriptionSuccessPage from "../Register/StepFormSubscription/SubscriptionSuccessPage";
//#endregion
import RootLayout from "../../components/layouts/rootLayout";
//#region Manage Preview Links
import PreviewLink from "../ManagePreviewLink/PreviewLinkList";
import ClinicianSecondStep from "../Register/SignUpPages/ClinicianSecondStep";
import DoctorSignup from "../Register/SignUpPages/DoctorSignup";
import PatDash from "../DashboardV2/PatientDashboard";
import Assessment from "../DashboardV2/PatientDashboard/Assessment/Assessment";
import CurrentLifeStyle from "../DashboardV2/PatientDashboard/Assessment/CurrentLifeStyle";
import GeneralIntakeForm from "../DashboardV2/PatientDashboard/Assessment/GeneralIntake/GeneralIntakeForm";
import Nutrition from "../DashboardV2/PatientDashboard/Assessment/Nutrition";
import SubstanceUse from "../DashboardV2/PatientDashboard/Assessment/Substance_Use";
import StressAndRelationship from "../DashboardV2/PatientDashboard/Assessment/StressAndRelationship";
import HealthAndMedicalHistory from "../DashboardV2/PatientDashboard/Assessment/HealthAndMedicalHistory";
import PersonalAndFamilyHistory from "../DashboardV2/PatientDashboard/Assessment/FamilyHistory";
import IllnessAndCondition from "../DashboardV2/PatientDashboard/Assessment/IllnessAndCondition";
import SymptomReview from "../DashboardV2/PatientDashboard/Assessment/SymptomReview";
import Readiness from "../DashboardV2/PatientDashboard/Assessment/Readiness";
import DoctorRegister from "../Register/SignUpPages/DoctorOverview";
import HormoneChart from "../DashboardV2/PatientDashboard/Chart";
import DoctorDash from "../DashboardV2/DoctorDashboard/DoctorDash";
import UserInfo from "../DashboardV2/DoctorDashboard/UserInfo";
import PatientAppointment from "../ManageAppointment/PatientAppointment/PatientAppointMent";
import ReproductiveHealth from "../DashboardV2/PatientDashboard/Assessment/ReproductiveHealth";
import SubscriptionPlanV2 from "../../screens/Subscription/index";
import PaymentDetails from "../../screens/Subscription/payment-details";
import PrePlan from "../../screens/Subscription/pre-plan";
import SecondPlan from "../../screens/Subscription/second-plan";
import AppointmentList from "../DashboardV2/DoctorDashboard/AppointmentList";
import UserManagement from "../Admin/UserManagement";
import LearnInfo from "../DashboardV2/PatientDashboard/Learning";
import SettingsPage from "../DashboardV2/Settings";
import NewHormoneChart from "../DashboardV2/PatientDashboard/NewChart";
import LabScreen from "../DashboardV2/PatientDashboard/Lab";
import PatientAppointmentList from "../DashboardV2/PatientDashboard/AppontmentList";
import LabsAndRequisitions from "../DashboardV2/DoctorDashboard/Lab";
import MedicationTable from "../DashboardV2/DoctorDashboard/Medications";
import MedScreen from "../DashboardV2/PatientDashboard/Meds";
import MenstrualCycleQuiz from "../DashboardV2/PatientDashboard/Learning/MenstrualCycleQuiz";
import Services from "../DashboardV2/PatientDashboard/Services";
import TermsOfService from "../../pages/TermsOfService";
import CollectionNotice from "../../pages/CollectionNotice";
import PrivacyPolicy from "../../pages/PrivacyPolicy";
import ConfidentialityAgreement from "../../pages/ConfidentialityAgreement";
import Note from "../DashboardV2/DoctorDashboard/Note";
import PatientNote from "../DashboardV2/PatientDashboard/Note";
import Fax from "../DashboardV2/DoctorDashboard/Fax";
import SupplementScreen from "../DashboardV2/PatientDashboard/Supplement";

//#endregion

const allowedDoctorRoles = ['Nurse', 'Doctor', 'PharmacistClinician', 'NutritionalPractitioner','Nutritionist', 'FertilitySupport', 'FertilityEducator','Pharmacist'];
const RoleProtectedRoute = ({ element, allowedRoles }) => {
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Patient') {
    return <><Navigate to="/patient" replace /><PatDash /></>;
  }

  if (!userAuth || Object.keys(userAuth).length === 0) {
    return <Navigate to="/" replace />;
  }

  const userRole = userAuth.obj.role;

  if (allowedRoles.includes(userRole)) {
    return element;
  }

  return <Navigate to="/" replace />;
};

const ProtectedRoute = ({ allowedRoles }) => {
  console.log('allowedRoles', allowedRoles)
  const userAuth = useSelector((state) => state?.authentication?.userAuth);

  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Patient') {
    return <><Navigate to="/patient" replace /><PatDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Admin') {
    return <><Navigate to="/admin" replace /><UserManagement /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Nurse') {
    return <><Navigate to="/nurse" replace /><DoctorDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Pharmacist') {
    return <><Navigate to="/pharmacist" replace /><DoctorDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'Nutritionist') {
    return <><Navigate to="/nutritionist" replace /><DoctorDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'FertilitySupport') {
    return <><Navigate to="/fertility-support" replace /><DoctorDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && userAuth.obj.role === 'FertilityEducator') {
    return <><Navigate to="/fertility-educator" replace /><DoctorDash /></>;
  }
  if (userAuth && Object.keys(userAuth).length > 0 && (allowedRoles.includes(userAuth.obj.role))) {
    return <><Navigate to="/doctor" replace /><DoctorDash /></>;
  }
  return <Login />;
};

const getRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="admin" element={<AdminLogin />} />
        <Route path="register" element={<Register />} />
        <Route path="patientSignup" element={<PatientSignup />} />
        <Route path="clinician" element={<ClinicianSecondStep />} />
        <Route path="clinicianSignup" element={<DoctorSignup />} />
        <Route path="clinicianRegister" element={<DoctorRegister />} />
        <Route path="terms-of-service" element={<TermsOfService />} />
        <Route path="collection-notice" element={<CollectionNotice />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="confidentiality-agreement" element={<ConfidentialityAgreement />} />

        <Route path="/forgot-password/:id?" element={<ResetPassword />} />

        <Route path="reset-password" element={<ForgotPassword />} />
      </Route>
      {/* <Route element={<ProtectedLayout />}> */}
      <Route element={<RootLayout />}>
        {/* <Route path="home" element={<Dashboard />} /> */}
        <Route path="patient" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="doctor" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="nurse" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="pharmacist" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="nutritionist" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="fertility-support" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />
        <Route path="fertility-educator" element={<ProtectedRoute allowedRoles={allowedDoctorRoles} />} />

        <Route
          path="doctor/user/:id?"
          element={
            <RoleProtectedRoute
              element={<UserInfo />}
              allowedRoles={allowedDoctorRoles}
            />
          }
        />
        <Route
          path="doctor/appointment"
          element={
            <RoleProtectedRoute
              element={<Appointment />}
              allowedRoles={allowedDoctorRoles}
            />
          }
        />
        <Route path="users" element={<UserManagement />} />
        <Route path="assessment" element={<Assessment />} />
        <Route path="chart" element={<HormoneChart />} />
        <Route path="newchart" element={<NewHormoneChart />} />
        
        <Route path="menstrual-cycle-quiz" element={<MenstrualCycleQuiz />} />
        <Route path="learning/quiz" element={<MenstrualCycleQuiz />} />

        <Route path="plans" element={<SubscriptionPlanV2 />} />
        <Route path="payment-details" element={<PaymentDetails />} />
        <Route path="questionnaire/1" element={<GeneralIntakeForm />} />
        <Route path="questionnaire/2" element={<CurrentLifeStyle />} />
        <Route path="questionnaire/3" element={<Nutrition />} />
        <Route path="questionnaire/4" element={<SubstanceUse />} />
        <Route path="questionnaire/5" element={<StressAndRelationship />} />
        <Route path="questionnaire/6" element={<HealthAndMedicalHistory />} />
        <Route path="questionnaire/7" element={<PersonalAndFamilyHistory />} />
        <Route path="questionnaire/8" element={<IllnessAndCondition />} />
        <Route path="questionnaire/9" element={<SymptomReview />} />
        <Route path="questionnaire/10" element={<Readiness />} />
        <Route path="questionnaire/11" element={<ReproductiveHealth />} />
        <Route path="profile" element={<Profile />} />
        <Route path="info-hub" element={<LearnInfo />} />

        <Route path="update-password" element={<Password />} />
        #region Medication
        <Route path="medication" element={<Medication />} />
        <Route path="pre-plan" element={<PrePlan />} />
        <Route path="second-plan" element={<SecondPlan />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* <Route path="inbox" element={<AdminInbox />} /> */}

        #endregion #region Appointment
        <Route path="patient/calendar" element={<PatientAppointment />} />
        <Route path="patient/services" element={<Services />} />
        <Route path="patient/appointment" element={<PatientAppointmentList />} />
        <Route path="patient/notes" element={<PatientNote />} />
        <Route path="patient/supplements" element={<SupplementScreen />} />

        <Route path="doctor/appointments" element={<AppointmentList />} />
        <Route path="doctor/labs" element={<LabsAndRequisitions />} />
        <Route path="doctor/fax" element={<Fax />} />

        <Route path="doctor/meds" element={<MedicationTable />} />
        
        <Route path="doctor/notes" element={<Note />} />

        
        <Route path="patient/labs" element={<LabScreen />} />
        <Route path="patient/meds" element={<MedScreen />} />

        <Route path="appointment" element={<PatientAppointment />} />
        <Route path="labs" element={<LabScreen />} />

        #endregion #region Learn
        <Route path="learn" element={<LearnInfo />} />
        #endregion #region subscription-plan
        <Route path="preview-link" element={<PreviewLink />} />
        #endregion
        <Route path="not-found" element={<NotFound />} />
        {/* if user enter route which is does not exist then this below route page will be called by default */}
        {/* </Route> */}
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
  ),
);

function RouteComp() {
  return (
    <main>
      <RouterProvider router={getRouter} />
    </main>
  );
}

export default RouteComp;
