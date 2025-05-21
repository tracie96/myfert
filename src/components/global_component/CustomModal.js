import React from "react";
import { Modal } from "react-bootstrap";

const CustomModal = ({
  show,
  onHide,
  size = "lg", // 
  classes = "",
  title,
  body,
  footer,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size={size}
      backdrop="static"
      keyboard={false}
      centered
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header
        closeButton
      >
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      {footer && (
        <Modal.Footer className="justify-content-center">{footer}</Modal.Footer>
      )}
    </Modal>
  );
};

export default CustomModal;
