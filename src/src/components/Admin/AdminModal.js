import styled from "styled-components";
import { Modal } from "antd";

const AdminModal = styled(Modal)`
    .ant-modal-header {
      background: #335CAD;
    }
    .ant-modal-title {
      color: white;
      padding: 5% 0;
      font-size: 20px;
    }
    .ant-modal-content {
      padding: 0;
      padding-bottom: 24px;
    }
    .ant-modal-body {
      margin: 0 24px;
    }
    .ant-modal-footer {
      margin: 24px 24px 0px;
    }
    .ant-modal-close-icon {
      color: white;
    }
  `

export default AdminModal;