import React, {Fragment, useState} from "react";
import {Redirect} from "react-router-dom";

import "./index.scss";
import {readUrlQueryValue} from "../../utils/utils";

const LoginScreen = () => {
  const [loginForm, updateLoginForm] = useState({
    email: {value: "", isValid: true},
    password: {value: "", isValid: true}
  });
  const onChangeHandler = ({target}) => {
    updateLoginForm({
      ...loginForm,
      [target.name]: {value: target.value, isValid: target.value !== ""}
    });
  };
  const isFormValid = Object.values(loginForm).filter(each => {
    return each.value !== "" && each.isValid
  }).length === Object.keys(loginForm).length;
  return(
    <Fragment>
      <div className="auth-card-title">
        <p>Welcome</p>
        <p>Login to your account</p>
      </div>
      <div className="auth-card-form">
        <input placeholder="Email" name="email" onChange={onChangeHandler}/>
        <input placeholder="Password" name="password" onChange={onChangeHandler}/>
        <button disabled={!isFormValid}>Login</button>
      </div>
    </Fragment>
  )
};

const AuthScreen = () => {
  switch(readUrlQueryValue("type")){
    case "login":
      return <LoginScreen/>;
    default:
      return <Redirect to="/auth?type=login"/>
  }
};

const Auth = () => {
  return(
    <div className="auth-container">
      <div className="auth-card">
        <AuthScreen/>
      </div>
    </div>
  )
};

export default Auth