import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import RouteComp from "./components/routes/route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { logoutAction } from "./components/redux/AuthController";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(logoutAction());
    }, 1800000);

    return () => clearTimeout(timer);
  }, [dispatch]);
  return (
    <>
      <ToastContainer />
      <RouteComp />
    </>
  );
}

export default App;
