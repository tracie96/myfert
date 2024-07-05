import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import {
  getUpdatedSubscriptionDetail,
  logoutAction,
  setReduxUserAuthValuesUndefined,
  updateReduxUserAuth,
} from "../../redux/AuthController";
import fertilityImage from "../../../assets/images/auth/fertilityImage.svg";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const SubscriptionSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentTicksCorrect, setPaymentTicksCorrect] = useState(false);
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);

  const { paymentTimeTicks } = useParams();

  const handleDispatch = async () => {
    // const updateUserAuth = {
    //   ...loggedInUser,
    //   isPaymentComplete: true,
    // };
    // delete updateUserAuth.paymentTimeTicks;
    // dispatch(updateReduxUserAuth(updateUserAuth));
    // navigate("/");

    try {
      setIsLoading(true);
      const getSubscriptionResponse = await dispatch(
        getUpdatedSubscriptionDetail(loggedInUser.id)
      );

      if (
        getSubscriptionResponse.payload &&
        !getSubscriptionResponse.payload?.isSomethingFailure
      ) {
        // await updateUserAuthReduxValues();
        await setUserAuthUndefined();
        // toast.success("Welcome To Dashboard!");
        toast.success("Your subscription has been verified!");
        navigate("/", { state: "subscriptionSucceded" });
      } else {
        await setUserAuthUndefined();
        toast.error(
          "Your subscription payment is currently being processed. We will notify you as soon as it has been verified."
          //"Apologies, it seems that there was a failure in processing your subscription payment transaction. Please kindly reach out to our administration team for further assistance and resolution. Thank you for your understanding"
        );
        navigate("/");
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      await setUserAuthUndefined();
      toast.error(
        "Your subscription payment is currently being processed. We will notify you as soon as it has been verified."
        //"Apologies, it seems that there was a failure in processing your subscription payment transaction. Please kindly reach out to our administration team for further assistance and resolution. Thank you for your understanding"
      );
      setIsLoading(false);
    }
  };

  const setUserAuthUndefined = async () => {
    dispatch(setReduxUserAuthValuesUndefined()); // values to undefined
  };
  // const updateUserAuthReduxValues = async () => {
  //   const updateUserAuth = {
  //     ...loggedInUser,
  //     isPaymentComplete: true,
  //   };
  //   delete updateUserAuth.paymentTimeTicks;
  //   dispatch(updateReduxUserAuth(updateUserAuth));
  // };

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
  }, [loggedInUser]);

  if (!paymentTicksCorrect) {
    if (paymentTimeTicks && loggedInUser?.paymentTimeTicks) {
      if (paymentTimeTicks === loggedInUser?.paymentTimeTicks) {
        // handleDispatch();
        setPaymentTicksCorrect(true);
      }
    }
  }

  return (
    <>
      {paymentTicksCorrect ? (
        <div className="bg-gradient-white">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <nav className="navbar mt-3">
                  <img
                    className="float-left"
                    src={fertilityImage}
                    alt="loginImage"
                    style={{ width: "150px" }}
                  />
                  <form className="d-flex" role="search">
                    {/* <button className="btn btn-outline-success" type="submit">
                    Search
                  </button> */}
                    <button
                      className="btn btn-primary btn-user btn-block"
                      onClick={() => dispatch(logoutAction())}
                    >
                      <span>Logout</span>
                    </button>
                  </form>
                </nav>
              </div>
            </div>
            <div className="row my-3">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="mt-5">
                  <h2>
                    <b>
                      Congratulations on your successful subscription purchase!
                    </b>
                  </h2>
                </div>
                <div className="mt-5">
                  <h5>
                    We are pleased to inform you that your subscription has been
                    completed successfully.
                  </h5>
                </div>
                <div className="mt-5">
                  <h5>
                    Thank you for choosing our services. We look forward to
                    providing you with an exceptional experience.
                  </h5>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12 d-flex">
                <div className="text-center">
                  <div className="row">
                    <img
                      alt="Under Development"
                      // src="https://cdn-icons-png.flaticon.com/512/4192/4192798.png"
                      src="https://i.pinimg.com/originals/74/2f/7e/742f7ea29cbfd7fd3f4848f17e621070.gif"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <button
                    className="btn text-white font-weight-bold"
                    style={{ backgroundColor: "#00aef5" }}
                    onClick={handleDispatch}
                    disabled={isLoading}
                  >
                    Verify Payment
                    {/* ← Proceed To Dashboard */}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Navigate to="/subscription-plan" />
      )}
    </>
  );
};

export default SubscriptionSuccessPage;
