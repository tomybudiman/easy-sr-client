import React, {Fragment, useState} from "react";

import {loginMethod} from "./fetch";
import history from "../../utils/history";

const AuthLoginScreen = () => {
  const [loginForm, updateLoginForm] = useState({
    email: {value: "", isValid: true},
    password: {value: "", isValid: true}
  });
  const [buttonBusyStatus, setButtonStatus] = useState(false);
  const isFormValid = Object.values(loginForm).filter(each => {
    return each.value !== "" && each.isValid
  }).length === Object.keys(loginForm).length;
  // Methods
  const onChangeHandler = ({target}) => {
    updateLoginForm({
      ...loginForm,
      [target.name]: {value: target.value, isValid: target.value !== ""}
    });
  };
  const onSubmitHandler = () => {
    setButtonStatus(true);
    loginMethod(loginForm.email.value, loginForm.password.value).then(() => {
      history.replace({pathname: "/dashboard"});
    }).catch(() => setButtonStatus(false));
  };
  const enterButtonHandler = e => {
    const keyCode = e.keyCode || e.which;
    if(keyCode === 13){
      const nextElement = e.target.nextSibling;
      if(nextElement.tagName === "INPUT"){
        nextElement.focus();
      }else{
        e.target.blur();
        nextElement.click();
      }
    }
  };
  return(
    <Fragment>
      <div className="auth-card-title">
        <p>Welcome</p>
        <p>Login to your account</p>
      </div>
      <div className="auth-card-form">
        <input placeholder="Email" name="email" onChange={onChangeHandler} onKeyDown={enterButtonHandler}/>
        <input placeholder="Password" name="password" type="password" onChange={onChangeHandler} onKeyDown={enterButtonHandler}/>
        <button
          disabled={!buttonBusyStatus ? !isFormValid : buttonBusyStatus}
          onClick={onSubmitHandler}>
          Login
        </button>
      </div>
    </Fragment>
  )
};

export default AuthLoginScreen