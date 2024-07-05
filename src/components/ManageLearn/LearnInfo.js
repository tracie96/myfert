import React, { useEffect, useState } from "react";
import "./Learn.css";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPreviewLinkList } from "../redux/patientSlice";
import defaultIconImage from "../../assets/images/users/user1.jpg";

const LearnInfo = ({ tabInfo }) => {
  const dispatch = useDispatch();
  const { userAuth } = useSelector((state) => state.authentication);
  const [showSpinner, setShowSpinner] = useState(false);
  const [previewLinkDto, setPreviewLinkDto] = useState([]);
console.log(showSpinner,userAuth)
  const fetchPreviewLinkListData = async () => {
    setShowSpinner(true);
    try {
      const response = await dispatch(getPreviewLinkList());

      if (getPreviewLinkList.fulfilled.match(response)) {
        console.log("preview link list data : ", response);
        console.log("preview link list data pay : ", response?.payload);
        setPreviewLinkDto(response?.payload);
        console.log("set preview link Dto : ", previewLinkDto);
      }
    } catch (error) {
      console.error("Error fetching graph data:", error);
    } finally {
      setShowSpinner(false);
    }
  };

  useEffect(() => {
    fetchPreviewLinkListData();
  }, [fetchPreviewLinkListData]);

  return (
    <>
      <div className="row">
        <div className="col-10 offset-1 mb-4">
          <form className="user">
            <p type="text" className="block-learn-info">
              {tabInfo}
            </p>
          </form>
        </div>
      </div>
      <Row>
        <Col md={12}>
          <Row>
            {previewLinkDto &&
              previewLinkDto.map((item, index) => (
                <div key={index} className="col-lg-4 mb-2">
                  <form className="user">
                    <Card className="rounded-3">
                      <CardHeader
                        className="text-center p-3 h6 rounded-bottom border-0"
                        style={{ backgroundColor: "white" }}
                      >
                        {item.title}
                      </CardHeader>
                      <CardBody
                        className="p-3"
                        style={{
                          backgroundImage: `url(${
                            item.primaryImage || defaultIconImage
                          })`,
                          backgroundSize: "contain",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center center",
                          height: "200px",
                          width: "100%",
                        }}
                      ></CardBody>
                      <CardFooter className="text-center border-0 mt-2 bg-white">
                        <a
                          className="btn btn-block btn-user text-white font-weight-bold"
                          // style={{ backgroundColor: "#10a997" }}
                          style={{ backgroundColor: "blue" }}
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </a>
                      </CardFooter>
                    </Card>
                  </form>
                </div>
              ))}
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default LearnInfo;
