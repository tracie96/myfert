import React, { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { activeUserCount } from "../redux/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.authentication);
  const [showSpinner, setShowSpinner] = useState(false);
  const [userCountDto, setUserCountDto] = useState(false);

  const fetchDashboardGraphData = async () => {
    setShowSpinner(true);
    try {
      const response = await dispatch(activeUserCount());

      if (activeUserCount.fulfilled.match(response)) {
        console.log("users count admin : ", response);
        setUserCountDto(response?.payload);
        console.log("set User Count Dto : ", userCountDto);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchDashboardGraphData();
  }, [fetchDashboardGraphData]);

  return (
    <>
      {/* Page Heading */}
      {/* users count Row */}
      <div className="card shadow mb-4">
        <Row>
          <Col md={12} className="text-center py-4">
            <h4 className=" font-weight-bold" style={{ color: "#01A5F8" }}>
              Admin Dashboard
            </h4>
          </Col>
        </Row>

        <Row>
          <div className="col-md-4 offset-md-1 mb-4">
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
                      userCountDto && userCountDto.totalDoctors
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 offset-md-1 mb-4">
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
                      userCountDto && userCountDto.totalPatients
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="col-md-5 offset-md-1 mb-4">
            <iframe
              width={250}
              height={250}
              src="https://www.youtube.com/embed/Axx9IMdL4jc?list=RDXwPDxTBIRSc"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
          <div className="col-md-5 offset-md-1 mb-4">
            <iframe
              width={250}
              height={250}
              frameborder="0"
              type="text/html"
              src="https://www.dailymotion.com/embed/video/x8t4qww?autoplay=1"
              allowfullscreen
              title="Dailymotion Video Player"
              allow="autoplay"
            ></iframe>
          </div> */}
        </Row>
      </div>
    </>
  );
};

export default AdminDashboard;
