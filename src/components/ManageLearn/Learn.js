import { useEffect, useState } from "react";
import "./Learn.css";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import LearnInfo from "./LearnInfo";

const Learn = () => {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.authentication);
  const [learnInfoVisibility, setLearnInfoVisibility] = useState(false);
  const [tabInfoText, setTabInfoText] = useState("");

  const tabInfoFunc = () => {
    setLearnInfoVisibility(true);
    setTabInfoText(
      <>
        <span>
          Within each category there will be:
          <br />
          <br />
          Program information
          <br />
          <br />
          Patient Protocols
          <br />
          <br />
          Guides on when to book appointments
          <br />
          <br />
          Info on blood testing (what we measure, plus why)
          <br />
          <br />
          Assessments Info (why we need all this info, info privacy and security
          etc)
          <br />
          <br />
          (MVP2 Charting instructions, video tutorials and how tos)
          <br />
          <br />
          Medications used, how to order it etc.
          <br />
          <br />
          Supporting Research
        </span>
      </>
    );
  };

  const handleBackToLearn = () => {
    setLearnInfoVisibility(false);
    setTabInfoText("");
  };

  return (
    <>
      <div className="row">
        {/* Content Column */}
        <div className="col-2 offset-1 mb-2">
          <button
            className="btn btn-sm btn-secondary"
            style={{ display: learnInfoVisibility ? "block" : "none" }}
            onClick={() => setLearnInfoVisibility(false)}
          >
            <i className="bi bi-arrow-left"></i> Back
          </button>
        </div>
      </div>

      <div style={{ display: learnInfoVisibility ? "none" : "block" }}>
        <div className="row">
          <div className="col-10 offset-1" onClick={tabInfoFunc}>
            <div className="learn-label">
              <p className="block-box">
                Fertility Screening
                <br />- Day 3 (hers)
                <br />- Day 3 (his)
                <br />- Full Cycle (hers)
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-10 offset-1" onClick={tabInfoFunc}>
            <div className="learn-label">
              <p className="block-box">
                Fertility Treatment
                <br />- 6 month plan
              </p>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-10 offset-1" onClick={tabInfoFunc}>
            <div className="learn-label">
              <p className="block-box">
                Pregnancy
                <br />- ProSPr
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bloodwork Bar Row */}
      {/* <div className="row">
        <div className="col-10 offset-1 mb-4">
          <form className="user">
            <p type="text" className="block-learn-info">
              Within each category there will be:
              <br />
              <br />
              Program information
              <br />
              <br />
              Patient Protocols
              <br />
              <br />
              Guides on when to book appointments
              <br />
              <br />
              Info on blood testing (what we measure, plus why)
              <br />
              <br />
              Assessments Info (why we need all this info, info privacy and
              security etc)
              <br />
              <br />
              (MVP2 Charting instructions, video tutorials and how tos)
              <br />
              <br />
              Medications used, how to order it etc.
              <br />
              <br />
              Supporting Research
            </p>
          </form>
        </div>
      </div> */}
      {learnInfoVisibility ? <LearnInfo tabInfo={tabInfoText} /> : ""}
    </>
  );
};
export default Learn;
