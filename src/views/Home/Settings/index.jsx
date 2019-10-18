import React from "react";
import {FormGroup, FormInput} from "shards-react";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

const Settings = () => {
  return(
    <div className="root-content">
      <PageRouteHeader>
        <Translator id="settingsGroup.settings"/>
      </PageRouteHeader>
      <div className="settings-container">
        <div className="change-password each-function">
          <p className="function-header">
            <Translator id="settingsGroup.changePassword"/>
          </p>
          <FormGroup>
            <label htmlFor="input-change-password-current">
              <Translator id="settingsGroup.currentPassword"/>
            </label>
            <FormInput
              id="input-change-password-current"/>
          </FormGroup>
          <FormGroup>
            <label htmlFor="input-change-password-verify">
              <Translator id="settingsGroup.newPassword"/>
            </label>
            <FormInput
              id="input-change-password-verify"/>
          </FormGroup>
        </div>
      </div>
    </div>
  )
};

export default Settings