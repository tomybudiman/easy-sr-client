import React, {useState} from "react";
import {
  ModalBody,
  ModalHeader,
  ModalFooter,
  FormGroup,
  FormInput,
  FormSelect,
  FormCheckbox,
  Button
} from "shards-react";
import {isEmpty} from "lodash/core";

import Translator from "../../../components/Translator";

const User = () => {
  return "User page"
};

export const CreateUserModal = () => {
  const [roleCheckbox, setRoleCheckbox] = useState({
    disclosure: false,
    materiality: false,
    reviewer: false
  });
  const [formStatus, updateFormStatus] = useState({
    fullname: {value: null, invalid: false},
    email: {value: null, invalid: false},
    department: {value: null, invalid: false},
    role: {value: null, invalid: false}
  });
  const toggleRoleCheckbox = (id) => {
    const newRoleCheckbox = {...roleCheckbox, [id]: !roleCheckbox[id]};
    const filterCheckbox = Object.keys(roleCheckbox).filter(eachKey => newRoleCheckbox[eachKey] !== false);
    setRoleCheckbox(newRoleCheckbox);
    updateFormField(filterCheckbox, "role");
  };
  const updateFormField = (data, id) => {
    switch(id){
      case "fullname":
        updateFormStatus({...formStatus, fullname: {value: data, invalid: isEmpty(data)}});
        break;
      case "email":
        const mailRegex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        updateFormStatus({...formStatus, email: {value: data, invalid: !mailRegex.test(data)}});
        break;
      case "department":
        updateFormStatus({...formStatus, department: {value: data, invalid: data === "default"}});
        break;
      case "role":
        updateFormStatus({...formStatus, role: {value: data, invalid: isEmpty(data)}});
        break;
      default:
        break;
    }
  };
  const checkFormThenSubmit = () => {
    let tempFormStatus = {...formStatus};
    const filterErrorform = Object.keys(tempFormStatus).filter(eachKey => {
      tempFormStatus = {
        ...tempFormStatus,
        [eachKey]: {
          ...tempFormStatus[eachKey],
          invalid: tempFormStatus[eachKey].value === null
        }
      };
      if(isEmpty(tempFormStatus[eachKey].value) || tempFormStatus[eachKey].invalid){
        return eachKey
      }
    });
    updateFormStatus(tempFormStatus);
    if(filterErrorform.length === 0){
      // Submit create new user form
    }
  };
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
          <FormInput
            id="input-new-user-fullname"
            invalid={formStatus.fullname.invalid}
            onChange={e => updateFormField(e.target.value, "fullname")}/>
        </FormGroup>
        <FormGroup className="input-new-user-email">
          <label htmlFor="input-new-user-email">
            <Translator id="userGroup.email"/>
          </label>
          <FormInput
            id="input-new-user-email"
            invalid={formStatus.email.invalid}
            onChange={e => updateFormField(e.target.value, "email")}/>
        </FormGroup>
        <FormGroup className="input-new-user-department">
          <label htmlFor="input-new-user-role">
            <Translator id="departmentGroup.department"/>
          </label>
          <FormSelect
            id="input-new-user-department"
            invalid={formStatus.department.invalid}
            onChange={e => updateFormField(e.target.value, "department")}>
            <option value="default">
              {Translator({id: "departmentGroup.selectDepartment"})}
            </option>
            <option value="department">Department</option>
          </FormSelect>
        </FormGroup>
        <FormGroup className="input-new-user-role">
          <label>
            <Translator id="userGroup.role"/>
          </label>
          <FormCheckbox
            className="custom-checkbox"
            checked={roleCheckbox.disclosure}
            onChange={() => toggleRoleCheckbox("disclosure")}>
            Disclosure
          </FormCheckbox>
          <FormCheckbox
            checked={roleCheckbox.materiality}
            onChange={() => toggleRoleCheckbox("materiality")}>
            Materiality Surveyor
          </FormCheckbox>
          <FormCheckbox
            checked={roleCheckbox.reviewer}
            onChange={() => toggleRoleCheckbox("reviewer")}>
            Reviewer
          </FormCheckbox>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button className="custom-button" onClick={() => checkFormThenSubmit()}>
          <Translator id="commonGroup.save"/>
        </Button>
      </ModalFooter>
    </React.Fragment>
  )
};

export default User