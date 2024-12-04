import React, { useState } from "react";
const PasswordInput = ({
  label,
  name,
  placeHolder,
  onChange,
  onBlur,
  value,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordVisibility = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };
  return (
    <>
      <div className="form-group col-lg-12">
        {label && (
          <label className="form-label ml-1 text-bold" htmlFor={name}>
            {label}
          </label>
        )}
        <div className="input-group">
          <input
            className="form-control form-control-user"
            name={name}
            type={showPassword ? "text" : "password"}
            autoComplete="off"
            id={name}
            placeholder={placeHolder ? placeHolder : "***"}
            required
            onChange={onChange}
            onBlur={onBlur}
            defaultValue={value}
          />
          <span className="input-group-text" onClick={passwordVisibility}>
            {showPassword ? (
              <i className="bi bi-eye"></i>
            ) : (
              <i className="bi bi-eye-slash"></i>
            )}
          </span>
        </div>
      </div>
    </>
  );
};
export default PasswordInput;
