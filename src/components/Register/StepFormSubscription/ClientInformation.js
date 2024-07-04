import React from "react";
import { FormGroup, Label, Input, Button } from "reactstrap";

const ClientInformation = (props) => {
  if (props.currentStep !== 4) {
    return null;
  }

  return (
    <>
      <p>Password 1 : password for your account</p>
      <FormGroup>
        <Label for="password">Password 1</Label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your Password 1"
          value={props.password1} // Prop: The username input data
          onChange={props.handleChange} // Prop: Puts data into the state
        />
      </FormGroup>
    </>
  );
};

export default ClientInformation;
