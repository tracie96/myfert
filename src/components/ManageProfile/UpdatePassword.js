import React, { useState } from "react";
import { useFormik } from "formik";
import { Form, Input, Button, Card, Row, Col, Typography, Spin } from "antd";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../redux/AuthController";

const UpdatePassword = () => {
  const { Title } = Typography;
  const loggedInUser = useSelector((state) => state?.authentication?.userAuth);
  const dispatch = useDispatch();
  const [showSpinner, setShowSpinner] = useState(false);
  const formik = useFormik({
    initialValues: {
      id: loggedInUser.id,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old Password is required"),
      newPassword: Yup.string().required("Password is required"),
      confirmPassword: Yup.string().required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setShowSpinner(true);
        const response = await dispatch(updateProfile(values));
        if (response) {
          setShowSpinner(false);
        }
      } catch (error) {
      } finally {
      }
    },
  });
  const isPasswordMatch =
    formik.values.newPassword === formik.values.confirmPassword;
  const updateButtonDisabled = !isPasswordMatch;
  const passwordMismatchMessage = !isPasswordMatch && (
    <div className="text-danger text-end">
      Password & Confirm Password do not match!
    </div>
  );

  return (
    <Row justify="center" align="middle" style={{ backgroundColor: "#fff" }}>
      <Col xs={24} sm={20} md={16} lg={12} xl={10}>
        <Card
          bordered={false}
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
        >
          <Title
            level={2}
            style={{ textAlign: "center", color: "#00ADEF", marginBottom: 20 }}
          >
            Update Password
          </Title>
          <Form layout="vertical" onFinish={formik.handleSubmit}>
            <input type="hidden" name="id" value={loggedInUser.id} />
            <Form.Item
              label="Old Password"
              validateStatus={formik.errors.oldPassword ? "error" : ""}
              help={formik.errors.oldPassword}
            >
              <Input.Password
                name="oldPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.oldPassword}
              />
            </Form.Item>

            <Form.Item
              label="New Password"
              validateStatus={formik.errors.newPassword ? "error" : ""}
              help={formik.errors.newPassword}
            >
              <Input.Password
                name="newPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.newpassword}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              validateStatus={formik.errors.confirmPassword ? "error" : ""}
              help={formik.errors.confirmPassword}
            >
              <Input.Password
                name="confirmPassword"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={showSpinner || updateButtonDisabled}
              >
                {showSpinner ? <Spin size="small" /> : "Update Password"}
              </Button>
            </Form.Item>
            {passwordMismatchMessage && (
              <div style={{ color: "red", textAlign: "center" }}>
                {passwordMismatchMessage}
              </div>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
export default UpdatePassword;
