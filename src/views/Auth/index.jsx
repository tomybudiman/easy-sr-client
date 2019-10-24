import React from "react";
import {Redirect} from "react-router-dom";

import "./index.scss";
import AuthLoginScreen from "./AuthLoginScreen";
import {readUrlQueryValue} from "../../utils/utils";

const AuthScreen = () => {
  switch(readUrlQueryValue("type")){
    case "login":
      return <AuthLoginScreen/>;
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