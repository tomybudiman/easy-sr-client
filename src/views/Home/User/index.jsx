import React from "react";
import {ModalBody, ModalHeader, FormGroup, FormInput, FormSelect} from "shards-react";

import Translator from "../../../components/Translator";

const User = () => {
  return "User page"
};

export const CreateUserModal = () => {
  return(
    <React.Fragment>
      <ModalHeader>
        <Translator id="userGroup.createNewUser"/>
      </ModalHeader>
      <ModalBody className="create-user-modal-body">
        <FormGroup className="input-new-user-fullname">
          <label htmlFor="input-new-user-fullname">
            <Translator id="userGroup.fullname"/>
          </label>
          <FormInput id="input-new-user-fullname"/>
        </FormGroup>
        <FormGroup className="input-new-user-email">
          <label htmlFor="input-new-user-email">
            <Translator id="userGroup.email"/>
          </label>
          <FormInput id="input-new-user-email"/>
        </FormGroup>
        <FormGroup className="input-new-user-role">
          <label htmlFor="input-new-user-role">
            <Translator id="userGroup.role"/>
          </label>
          <FormSelect id="input-new-user-role">
            <option>Disclosure</option>
            <option>Materiality Surveyor</option>
            <option>Reviewer</option>
          </FormSelect>
        </FormGroup>
        <FormGroup className="input-new-user-role">
          <label htmlFor="input-new-user-role">Department</label>
          <FormSelect id="input-new-user-role">
            <option>Department</option>
          </FormSelect>
        </FormGroup>
      </ModalBody>
    </React.Fragment>
  )
};

export default User