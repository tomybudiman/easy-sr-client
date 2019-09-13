import React, {useState} from "react";
import moment from "moment";
import {
  ModalBody, ModalHeader, ModalFooter, FormGroup, FormInput, FormSelect, FormCheckbox, Button as ButtonShards
} from "shards-react";
import MaterialTable, {MTableToolbar} from "material-table";
import Button from "@material-ui/core/Button";
import {isEmpty} from "lodash/core";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

const User = ({onClickEvent}) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false
  };
  const tableColumns = [
    {title: "Fullname", field: "fullname"},
    {title: "Email", field: "email"},
    {title: "Roles", render: ({roles}) => roles.join(", ")},
    {title: "Department", field: "department"},
    {title: "Created At", field: "createdAt"},
    {title: "Actions", render: rowData => (
      <Button className="datatable-action-button" onClick={() => setSelectedUser(rowData)}>
        <i className="fas fa-user-cog"/>
      </Button>
    )}
  ];
  const tableComponents = {
    Toolbar: props => (
      <React.Fragment>
        <MTableToolbar {...props}/>
        <div className="user-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createUser"}})}>
            <Translator id="userGroup.createNewUser"/>
          </Button>
        </div>
      </React.Fragment>
    )
  };
  const data = [
    {fullname: "Tomy Budiman", email: "tomy.budiman@acuralabs.ai", roles: ["disclosure_user", "materiality_surveyor"], department: "Whatever", createdAt: moment().toISOString()}
  ];
  return(
    <React.Fragment>
      <PageRouteHeader>
        <Translator id="userGroup.user"/>
      </PageRouteHeader>
      <MaterialTable
        data={data}
        style={tableStyle}
        columns={tableColumns}
        options={tableOptions}
        components={tableComponents}/>
    </React.Fragment>
  )
};

export const CreateUserModal = ({onClickClose}) => {
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
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="userGroup.createNewUser"/>
        <button className="close-button" onClick={onClickClose}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody>
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
        <ButtonShards className="custom-button" onClick={() => checkFormThenSubmit()}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </ModalFooter>
    </React.Fragment>
  )
};

export default User