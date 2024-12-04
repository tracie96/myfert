import React, { useCallback, useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { activeUserCount } from "../redux/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.authentication);
  const [showSpinner, setShowSpinner] = useState(false);
  const [userCountDto, setUserCountDto] = useState(null);
  console.log(userAuth);

  const fetchDashboardGraphData = useCallback(async () => {
    setShowSpinner(true);
    try {
      const response = await dispatch(activeUserCount());
      if (activeUserCount.fulfilled.match(response)) {
        setUserCountDto(response.payload);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setShowSpinner(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchDashboardGraphData();
  }, [fetchDashboardGraphData]);

  return (
    <div className="card shadow mb-4">
      <Row>
        <Col md={12} className="text-center py-4">
          <h4 className="font-weight-bold" style={{ color: "#01A5F8" }}>
            Admin Dashboard
          </h4>
        </Col>
      </Row>

      <Row>
        <Col md={4} className="offset-md-1 mb-4">
          <div className="card shadow mb-4 border-0">
            <div className="card-body">
              <div className="form-group col-lg-12">
                <h5 className="text-center" style={{ fontWeight: "bold" }}>
                  Total Doctors
                </h5>
                <p className="text-bold text-center">
                  {showSpinner ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    userCountDto?.totalDoctors ?? "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>
        </Col>
        <Col md={4} className="offset-md-1 mb-4">
          <div className="card shadow mb-4 border-0">
            <div className="card-body">
              <div className="form-group col-lg-12">
                <h5 className="text-center" style={{ fontWeight: "bold" }}>
                  Total Patients
                </h5>
                <p className="text-bold text-center">
                  {showSpinner ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    userCountDto?.totalPatients ?? "N/A"
                  )}
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
