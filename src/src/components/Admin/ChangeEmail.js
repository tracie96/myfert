import React, { useCallback, useState, } from "react";
import { useDispatch } from "react-redux";
import { Form, Input } from "antd";
import { validateEmail } from "../redux/AuthController";
import AdminModal from "./AdminModal";

const ChangeEmail = ({ isOpen, setOpen, account }) => {
  const [value, setValue] = useState('');

  const cleanup = () => {
    setOpen('');
  }

  const dispatch = useDispatch();
  const [emailCheck, setEmailCheck] = useState(null);
  
  const handleEmailBlur = useCallback(async () => {
    const email = value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email) {
      if (!emailRegex.test(email)) {
        setEmailCheck({ error: true, message: "Please enter a valid email" });
        return;
      }

      try {
        const result = await dispatch(validateEmail(email));
        if (validateEmail.fulfilled.match(result)) {
          setEmailCheck(result.payload);
        } else {
          setEmailCheck(null);
        }
      } catch (error) {
        console.error("Error validating email:", error);
      }
    } else {
      setEmailCheck(null);
    }
  }, [dispatch, value]);

  return <AdminModal
    title='Change Email'
    open={isOpen === 'Email'}
    onCancel={cleanup}
    footer={[
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="btn btn-secondary" onClick={cleanup}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={() => {
          console.log(`Account #${account}'s email has been set to ${value}`);

          cleanup();
        }}>
          Confirm
        </button>
      </div>
    ]}
  >
    <p style={{ marginBottom: '0.5rem' }}>Enter Account #{account}'s new email:</p>
    <Form.Item
      name="email"
      help={
        emailCheck && (
          <div
            style={{
              color:
                emailCheck.statusCode ===
                "200"
                  ? "green"
                  : "red",
              fontSize: "12px",
            }}
          >
            {emailCheck.message}
          </div>
        )
      }
      rules={[
        {
          required: true,
          message: "Please input your email!",
        },
      ]}
    >
      <Input
        value={value}
        onBlur={handleEmailBlur}
        onChange={(e) => setValue(e.target.value)}
      />
    </Form.Item>
  </AdminModal>
}

export default ChangeEmail;