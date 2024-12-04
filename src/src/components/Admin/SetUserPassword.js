import React from "react";
import AdminModal from "./AdminModal";

const SetUserPassword = ({ isOpen, setOpen, account }) => {
  const cleanup = () => {
    setOpen('');
  }

  return <AdminModal
    title='Reset User Password'
    open={isOpen === 'Password'}
    onCancel={cleanup}
    footer={[
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <button className="btn btn-secondary" onClick={cleanup}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => {
          console.log(`Account #${account}'s password has been reset`);

          cleanup();
        }}>
          Confirm
        </button>
      </div>
    ]}
  >
    <p style={{marginBottom: '0.5rem'}}>Are you sure you want to reset Account #{account}'s password?</p>
  </AdminModal>
}

export default SetUserPassword;