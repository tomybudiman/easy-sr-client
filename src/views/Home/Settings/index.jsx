import React, {useState} from "react";
import {FormGroup, FormInput, Button as ButtonShards, FormFeedback} from "shards-react";

import {updateUserPassword} from "./fetch";
import Translator from "../../../components/Translator";

const Settings = () => {
  const [formField, updateFormField] = useState({
    currentPassword: {value: null, invalid: false, isPassword: true},
    newPassword: {value: null, invalid: false, isPassword: true}
  });
  const [mainButtonDisabled, setButtonDisabled] = useState(false);
  // Methods
  const onChangeHandler = e => {
    const fieldVal = e.currentTarget.value;
    const fieldKey = e.currentTarget.getAttribute("name");
    const validatePassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
    updateFormField({...formField, [fieldKey]: {...formField[fieldKey], value: fieldVal, invalid: !validatePassword.test(fieldVal)}});
  };
  const checkThenSubmit = () => {
    const validatePassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
    const newFormFieldObj = Object.keys(formField).reduce((prevObj, objKey) => ({
      ...prevObj,
      [objKey]: {...prevObj[objKey], invalid: !validatePassword.test(prevObj[objKey].value)}
    }), formField);
    updateFormField(newFormFieldObj);
    const isFormValid = Object.values(newFormFieldObj).filter(({value, invalid}) => !validatePassword.test(value) && invalid).length === 0;
    if(isFormValid){
      setButtonDisabled(true);
      updateUserPassword({
        old_password: formField.currentPassword.value,
        new_password: formField.newPassword.value,
        confirm_new_password: formField.newPassword.value
      }).finally(() => setButtonDisabled(false));
    }
  };
  const togglePasswordView = e => {
    const fieldName = e.currentTarget.previousElementSibling.getAttribute("name");
    updateFormField({...formField, [fieldName]: {...formField[fieldName], isPassword: !formField[fieldName].isPassword}});
  };
  return(
    <div className="settings-container">
      <div className="change-password each-function">
        <p className="function-header">
          <Translator id="settingsGroup.changePassword"/>
        </p>
        <FormGroup>
          <label htmlFor="input-change-password-current">
            <Translator id="settingsGroup.currentPassword"/>
          </label>
          <div className="password-container">
            <FormInput
              name="currentPassword"
              onChange={onChangeHandler}
              id="input-change-password-current"
              type={formField.currentPassword.isPassword ? "password" : "text"}/>
            <button onClick={togglePasswordView}>
              {formField.currentPassword.isPassword ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </button>
          </div>
          {formField.currentPassword.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.passwordInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
        <FormGroup>
          <label htmlFor="input-change-password-verify">
            <Translator id="settingsGroup.newPassword"/>
          </label>
          <div className="password-container">
            <FormInput
              name="newPassword"
              onChange={onChangeHandler}
              id="input-change-password-verify"
              type={formField.newPassword.isPassword ? "password" : "text"}/>
            <button onClick={togglePasswordView}>
              {formField.newPassword.isPassword ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </button>
          </div>
          {formField.newPassword.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.passwordInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
        <ButtonShards className="custom-button" disabled={mainButtonDisabled} onClick={checkThenSubmit}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </div>
    </div>
  )
};

export default Settings