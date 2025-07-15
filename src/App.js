import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import RouteComp from "./components/routes/route";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from './components/Handler/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ToastContainer />
      <RouteComp />
    </ErrorBoundary>
  );
}

export default App;
