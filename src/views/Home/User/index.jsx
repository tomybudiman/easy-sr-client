import React, {Component, useState} from "react";
import {
  ModalBody, ModalHeader, ModalFooter, FormGroup, FormFeedback, FormInput, Button as ButtonShards
} from "shards-react";
import {isEmpty, get, difference} from "lodash";
import {NotificationManager} from "react-notifications";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import uuid from "uuidv4";

import store from "../../../state";
import Translator, {localeData} from "../../../components/Translator";
import {setSelectedUserEdit} from "../../../state/actions";
import {getUsers, createUser, updateUserRole, toggleLockUser} from "./fetch";
import PageRouteHeader from "../../../components/PageRouteHeader";
import moment from "moment";

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

class User extends Component {
  constructor(props){
    super(props);
    this.tableRef = null;
  }
  data(query){
    return new Promise(resolve => {
      getUsers().then(res => {
        resolve({
          data: res.rows.map(each => {
            return {
              raw: each,
              formatted: {
                fullname: each.fullname,
                email: each.email,
                roles: each.roles.map(eachRole => getRoleAlias(eachRole.name)).join(", "),
                department: "Whatever",
                createdAt: each.createdAt
              }
            };
          }),
          page: res.page - 1,
          totalCount: res.count
        });
      });
    });
  };
  // Component Lifecycle
  componentDidUpdate(prevProps){
    if(get(prevProps, "prevEvent.uid") !== get(this.props, "prevEvent.uid")){
      switch(get(this.props, "prevEvent.type")){
        case "createUser":
        case "editUser":
          setTimeout(this.tableRef.onQueryChange, 0);
          break;
        default:
          break;
      }
    }
  }
  render(){
    const {onClickEvent} = this.props;
    const tableStyle = {
      marginTop: "16px",
      boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
    };
    const tableOptions = {
      showTitle: false,
      search: false
    };
    const tableColumns = [
      {title: "Fullname", filtering: false, sorting: false, render: ({formatted}) => formatted.fullname},
      {title: "Email", filtering: false, sorting: false, render: ({formatted}) => formatted.email},
      {title: "Roles", filtering: false, sorting: false, render: ({formatted}) => formatted.roles},
      {title: "Created At", filtering: false, sorting: false, render: ({formatted}) => {
        return moment(formatted.createdAt).format("DD MMMM YYYY HH:mm");
      }},
      {title: "Actions", render: ({raw}) => {
        return(
          <Button className="datatable-action-button" onClick={e => {
            store.dispatch(setSelectedUserEdit(raw));
            onClickEvent({e, data: {id: "editUser"}});
          }}>
            <i className="fas fa-user-cog"/>
          </Button>
        )
      }, filtering: false, sorting: false}
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
    // return null
    return(
      <React.Fragment>
        <PageRouteHeader>
          <Translator id="userGroup.user"/>
        </PageRouteHeader>
        <MaterialTable
          data={q => this.data(q)}
          style={tableStyle}
          columns={tableColumns}
          options={tableOptions}
          components={tableComponents}
          tableRef={e => this.tableRef = e}/>
      </React.Fragment>
    )
  }
}

export const EditUserModal = ({onClickClose}) => {
  const {id, roles, is_locked} = store.getState().reducerRouteUser.selectedUserEdit;
  const assignedRoles = roles.reduce((prevObj, {name}) => ({
    ...prevObj, [name]: {label: get(prevObj, `[${name}].label`) || "Superadmin", value: true}
  }), {
    org_admin: {label: "Admin", value: false},
    org_developer: {label: "Developer", value: false},
    org_viewer: {label: "Viewer", value: false}
  });
  const [isUserLocked, setUserLock] = useState(is_locked);
  const [roleInput, setRoleInput] = useState(assignedRoles);
  const [isUpdatingRoles, setUpdateStatus] = useState(false);
  const isSuperadmin = roleInput.hasOwnProperty("superadmin");
  // Methods
  const toggleRoleChip = roleId => {
    const baseObj = {...roleInput, [roleId]: {...roleInput[roleId], value: !roleInput[roleId].value}};
    setRoleInput(baseObj);
    if(isSuperadmin){
      setTimeout(() => {
        setRoleInput({...roleInput, [roleId]: {...roleInput[roleId], value: !baseObj[roleId].value}});
        NotificationManager.warning(get(localeData[store.getState().reducerLocale.locale], "warning.actionProhibited"));
      }, 300);
    }else{
      if(!isUpdatingRoles){
        const oldArrRoles = Object.keys(roleInput).filter(key => roleInput[key].value);
        const newArrRoles = Object.keys(baseObj).filter(key => baseObj[key].value);
        const addedRoles = difference(newArrRoles, oldArrRoles);
        const removedRoles = difference(oldArrRoles, newArrRoles);
        setUpdateStatus(true);
        updateUserRole({
          user_id: id,
          roles: addedRoles.length > 0 ? addedRoles : removedRoles
        }, addedRoles.length > 0).then(() => {
          NotificationManager.success(get(localeData[store.getState().reducerLocale.locale], "success.success"));
        }).finally(() => setUpdateStatus(false));
      }else{
        setTimeout(() => {
          setRoleInput({...roleInput, [roleId]: {...roleInput[roleId], value: !baseObj[roleId].value}});
        }, 1000);
      }
    }
  };
  const toggleLockSwicth = () => {
    setUserLock(!isUserLocked);
    toggleLockUser({id}, isUserLocked ? "unlock" : "lock").then(() => {
      setTimeout(() => {
        NotificationManager.success(get(localeData[store.getState().reducerLocale.locale], "success.success"));
      }, 1000);
    }).catch(() => {
      setUserLock(!isUserLocked);
    });
  };
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="userGroup.editUser"/>
        <button className="close-button" onClick={() => onClickClose({type: "editUser", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody className="edit-user">
        {!isSuperadmin ? (
          <FormGroup className="input-toggle-user-lock">
            <label>
              <Translator id="userGroup.toggleLock"/>
            </label>
            <div className="toggle-swicth-lock-user">
              <input type="checkbox" checked={!isUserLocked} onChange={toggleLockSwicth}/>
              <label>
                <p id="unlocked-user-label"><Translator id="commonGroup.locked"/></p>
                <p id="unlocked-user-label"><Translator id="commonGroup.active"/></p>
              </label>
              <span className="overlay-transition"/>
              <span className="overlay-background"/>
            </div>
          </FormGroup>
        ) : null}
        <FormGroup className="input-edit-user-role">
          <label>
            <Translator id="userGroup.role"/>
          </label>
          <div className={isUpdatingRoles ? "custom-input-form form-pending" : "custom-input-form"}>
            {Object.keys(roleInput).map((each, i) => {
              return(
                <div
                  key={i}
                  onClick={() => toggleRoleChip(each)}
                  className={roleInput[each].value ? "chip chip-active" : "chip"}>
                  <p className="label">{roleInput[each].label}</p>
                </div>
              )
            })}
          </div>
        </FormGroup>
      </ModalBody>
    </React.Fragment>
  )
};

export const CreateUserModal = ({onClickClose}) => {
  const [roleInput, setRoleInput] = useState({
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
    const newroleInput = {...roleInput, [id]: {...roleInput[id], value: !roleInput[id].value}};
    const filterCheckbox = Object.keys(roleInput).filter(eachKey => newroleInput[eachKey].value !== false);
    setRoleInput(newroleInput);
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
      const selectedNewRole = Object.keys(roleInput).filter(each => roleInput[each].value);
      try{
        const creatingUser = await createUser({
          email: formStatus.email.value,
          password: formStatus.password.value,
          confirm_password: formStatus.password.value,
          fullname: formStatus.fullname.value
        });
        const creatingUserRole = await updateUserRole({
          user_id: creatingUser.id,
          roles: selectedNewRole
        });
        if(creatingUserRole.result.length === selectedNewRole.length){
          onClickClose({type: "createUser", uid: uuid()});
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
        <button className="close-button" onClick={() => onClickClose({type: "createUser", uid: uuid()})}>
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
            {Object.keys(roleInput).map((each, i) => {
              return(
                <div
                  key={i}
                  onClick={() => toggleRoleChip(each)}
                  className={roleInput[each].value ? "chip chip-active" : "chip"}>
                  <p className="label">{roleInput[each].label}</p>
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

export default User