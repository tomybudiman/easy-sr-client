import React, {useState} from "react";
import {
  ModalBody, ModalHeader, ModalFooter, FormGroup, FormFeedback, FormInput, FormCheckbox, Button as ButtonShards
} from "shards-react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import {isEmpty} from "lodash/core";

import store from "../../../state";
import Translator from "../../../components/Translator";
import {setSelectedUserEdit} from "../../../state/actions";
import {getUsers, createUser, createUserRole} from "./fetch";
import PageRouteHeader from "../../../components/PageRouteHeader";

const getRoleAlias = id => {
  switch(id){
    case "superadmin":
      return "Superadmin";
    case "org_admin":
      return "Admin";
    case "org_developer":
      return "Developer";
    case "org_surveyor":
      return "Surveyor";
    case "org_viewer":
      return "Viewer";
    default:
      return null;
  }
};

const User = ({onClickEvent, prevEvent}) => {
  const [tableRef, setTableRef] = useState(null);
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false,
    search: false
  };
  const tableColumns = [
    {title: "Fullname", field: "fullname", filtering: false, sorting: false},
    {title: "Email", field: "email", filtering: false, sorting: false},
    {title: "Roles", field: "roles", filtering: false, sorting: false},
    {title: "Created At", field: "createdAt", filtering: false, sorting: false},
    {title: "Actions", render: rowData => (
      <Button className="datatable-action-button" onClick={e => {
        store.dispatch(setSelectedUserEdit(rowData));
        onClickEvent({e, data: {id: "editUser"}});
      }}>
        <i className="fas fa-user-cog"/>
      </Button>
    ), filtering: false, sorting: false}
  ];
  const tableComponents = {
    Toolbar: () => (
      <div className="user-datatable-toolbar">
        <Button size="small" onClick={e => onClickEvent({e, data: {id: "createUser"}})}>
          <Translator id="userGroup.createNewUser"/>
        </Button>
      </div>
    )
  };
  const data = query => {
    return new Promise(resolve => {
      getUsers().then(res => {
        const formattedData = res.rows.map(each => {
          return {
            fullname: each.fullname,
            email: each.email,
            roles: each.roles.map(eachRole => getRoleAlias(eachRole.name)).join(", "),
            department: "Whatever",
            createdAt: each.createdAt
          }
        });
        resolve({
          data: formattedData,
          page: res.page - 1,
          totalCount: res.count
        });
      });
    });
  };
  // INCOMING EVENT
  if(prevEvent === "createUser"){
    setTimeout(tableRef.onQueryChange, 0);
  }
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
        components={tableComponents}
        tableRef={e => setTableRef(e)}/>
    </React.Fragment>
  )
};

export const CreateUserModal = ({onClickClose}) => {
  const [roleCheckbox, setRoleCheckbox] = useState({
    org_admin: {label: "Admin", value: false},
    org_developer: {label: "Developer", value: false},
    org_viewer: {label: "Viewer", value: false}
  });
  const [formStatus, updateFormStatus] = useState({
    fullname: {value: null, invalid: false},
    email: {value: null, invalid: false},
    password: {value: null, invalid: false, isPassword: true},
    role: {value: null, invalid: false}
  });
  const [mainButtonDisabled, setButtonDisabled] = useState(false);
  // Functions
  const updateFormField = (data, id) => {
    switch(id){
      case "fullname":
        updateFormStatus({...formStatus, fullname: {value: data, invalid: isEmpty(data)}});
        break;
      case "email":
        const mailRegex = new RegExp(/^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        updateFormStatus({...formStatus, email: {value: data, invalid: !mailRegex.test(data)}});
        break;
      case "role":
        updateFormStatus({...formStatus, role: {value: data, invalid: isEmpty(data)}});
        break;
      case "password":
        const validatePassword = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.{8,})");
        updateFormStatus({
          ...formStatus,
          password: {...formStatus.password, value: data, invalid: !validatePassword.test(data)}
        });
        break;
      default:
        break;
    }
  };
  const toggleRoleChip = id => {
    const newRoleCheckbox = {...roleCheckbox, [id]: {...roleCheckbox[id], value: !roleCheckbox[id].value}};
    const filterCheckbox = Object.keys(roleCheckbox).filter(eachKey => newRoleCheckbox[eachKey].value !== false);
    setRoleCheckbox(newRoleCheckbox);
    updateFormField(filterCheckbox, "role");
  };
  const togglePasswordView = () => {
    updateFormStatus({
      ...formStatus,
      password: {...formStatus.password, isPassword: !formStatus.password.isPassword}
    });
  };
  const checkFormThenSubmit = async () => {
    let tempFormStatus = {...formStatus};
    const isFormValid = Object.keys(tempFormStatus).filter(eachKey => {
      tempFormStatus = {
        ...tempFormStatus,
        [eachKey]: {
          ...tempFormStatus[eachKey],
          invalid: tempFormStatus[eachKey].value === null || tempFormStatus[eachKey].value.length === 0
        }
      };
      return isEmpty(tempFormStatus[eachKey].value) || tempFormStatus[eachKey].invalid
    }).length === 0;
    updateFormStatus(tempFormStatus);
    if(isFormValid){
      setButtonDisabled(true);
      const selectedNewRole = Object.keys(roleCheckbox).filter(each => roleCheckbox[each].value);
      try{
        const creatingUser = await createUser({
          email: formStatus.email.value,
          password: formStatus.password.value,
          confirm_password: formStatus.password.value,
          fullname: formStatus.fullname.value
        });
        const creatingUserRole = await createUserRole({
          user_id: creatingUser.id,
          roles: selectedNewRole
        });
        if(creatingUserRole.result.length === selectedNewRole.length){
          onClickClose("createUser");
        }
      }catch(err){
        // console.log(err);
      }
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
      <ModalBody className="create-new-user">
        <FormGroup className="input-new-user-fullname">
          <label htmlFor="input-new-user-fullname">
            <Translator id="userGroup.fullname"/>
          </label>
          <FormInput
            id="input-new-user-fullname"
            invalid={formStatus.fullname.invalid}
            onChange={e => updateFormField(e.target.value, "fullname")}/>
          {formStatus.fullname.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.fieldEmptyInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
        <FormGroup className="input-new-user-email">
          <label htmlFor="input-new-user-email">
            <Translator id="userGroup.email"/>
          </label>
          <FormInput
            id="input-new-user-email"
            invalid={formStatus.email.invalid}
            onChange={e => updateFormField(e.target.value, "email")}/>
          {formStatus.email.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.emailInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
        <FormGroup className="input-new-user-password">
          <label htmlFor="input-new-user-password">
            <Translator id="userGroup.password"/>
          </label>
          <div className="password-container">
            <FormInput
              id="input-new-user-password"
              invalid={formStatus.password.invalid}
              type={formStatus.password.isPassword ? "password" : "text"}
              onChange={e => updateFormField(e.target.value, "password")}/>
            <button onClick={togglePasswordView}>
              {formStatus.password.isPassword ? <i className="fas fa-eye"/> : <i className="fas fa-eye-slash"/>}
            </button>
          </div>
          {formStatus.password.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.passwordInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
        <FormGroup className="input-new-user-role">
          <label>
            <Translator id="userGroup.role"/>
            {formStatus.role.invalid ? (
              <FormFeedback tag="p" valid={false}>
                <Translator id="warning.choseAnOption"/>
              </FormFeedback>
            ) : null}
          </label>
          <div className="custom-input-form">
            {Object.keys(roleCheckbox).map((each, i) => {
              return(
                <div
                  key={i}
                  onClick={() => toggleRoleChip(each)}
                  className={roleCheckbox[each].value ? "chip chip-active" : "chip"}>
                  <p className="label">{roleCheckbox[each].label}</p>
                </div>
              )
            })}
          </div>
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <ButtonShards
          className="custom-button"
          disabled={mainButtonDisabled}
          onClick={() => checkFormThenSubmit()}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </ModalFooter>
    </React.Fragment>
  )
};

export const EditUserModal = ({onClickClose}) => {
  console.log(store.getState().reducerRouteUser);
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="userGroup.editUser"/>
        <button className="close-button" onClick={onClickClose}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter></ModalFooter>
    </React.Fragment>
  )
};

export default User