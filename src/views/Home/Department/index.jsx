import React, {useState, Component} from "react";
import MaterialTable from "material-table";
import {FormGroup, FormInput, FormFeedback, ModalBody, ModalFooter, ModalHeader, Button as ButtonShards} from "shards-react";
import Button from "@material-ui/core/Button";
import {get, isEmpty} from "lodash";
import uuid from "uuidv4";

import store from "../../../state";
import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";
import {setSelectedDepartmentEdit} from "../../../state/actions";
import {getDepartments, createDepartment, deleteDepartment, updateDepartment} from "./fetch";

class Department extends Component {
  constructor(props){
    super(props);
    this.tableRef = null;
  }
  // Component Lifecycle
  componentDidUpdate(prevProps){
    if(get(prevProps, "prevEvent.uid") !== get(this.props, "prevEvent.uid")){
      const arrOfEvents = ["createDepartment", "editDepartment", "deleteDepartment"];
      if(arrOfEvents.includes(get(this.props, "prevEvent.type"))){
        setTimeout(this.tableRef.onQueryChange, 0);
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
      {title: "Name", field: "name", filtering: false, sorting: false},
      {title: "Number of Users", filtering: false, sorting: false},
      {title: "Action", render: (raw) => {
        return(
          <Button className="datatable-action-button" onClick={e => {
            store.dispatch(setSelectedDepartmentEdit(raw));
            onClickEvent({e, data: {id: "editDepartment"}});
          }}>
            <i className="fas fa-cog"/>
          </Button>
        )
      }, filtering: false, sorting: false}
    ];
    const tableComponents = {
      Toolbar: () => (
        <div className="department-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createDepartment"}})}>
            <Translator id="departmentGroup.createNewDepartment"/>
          </Button>
        </div>
      )
    };
    const data = query => {
      return new Promise(resolve => {
        getDepartments().then(res => resolve({
          data: res.rows,
          page: res.page - 1,
          totalCount: res.count
        }));
      });
    };
    return(
      <React.Fragment>
        <PageRouteHeader>
          <Translator id="departmentGroup.department"/>
        </PageRouteHeader>
        <MaterialTable
          data={data}
          style={tableStyle}
          options={tableOptions}
          columns={tableColumns}
          components={tableComponents}
          tableRef={e => this.tableRef = e}/>
      </React.Fragment>
    )
  }
}

export const CreateDepartmentModal = ({onClickClose}) => {
  const [formField, setFormField] = useState({
    departmentName: {value: "", invalid: false}
  });
  const [mainButtonDisabled, setButtonDisabled] = useState(false);
  const updateFormField = ({target}) => {
    if(Object.keys(formField).includes(target.name)){
      // const value = target.value.trim().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
      setFormField({...formField, [target.name]: {value: target.value, invalid: isEmpty(target.value)}});
    }
  };
  const checkFormThenSubmit = async () => {
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      setButtonDisabled(true);
      try{
        const awaitCreateDepartment = createDepartment({name: formField.departmentName.value});
        if(awaitCreateDepartment.createdAt){
          onClickClose({type: "createDepartment", uid: uuid()});
        }
      }catch(err){
        // console.error(err);
        setButtonDisabled(false);
      }
    }else{
      setFormField(newFormField);
    }
  };
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="departmentGroup.createNewDepartment"/>
        <button className="close-button" onClick={() => onClickClose({type: "createDepartment", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody>
        <FormGroup className="input-new-department-name">
          <label htmlFor="input-new-department-name">
            <Translator id="departmentGroup.departmentName"/>
          </label>
          <FormInput
            name="departmentName"
            id="input-new-department-name"
            invalid={formField.departmentName.invalid}
            onChange={updateFormField}/>
          {formField.departmentName.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.fieldEmptyInvalid"/>
            </FormFeedback>
          ) : null}
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

export const EditDepartmentModal = ({onClickClose}) => {
  const {selectedDepartmentEdit} = store.getState().reducerRouteDepartment;
  const [verifyDelete, setVerifyStatus] = useState(false);
  const [formField, setFormField] = useState({
    departmentName: {value: get(selectedDepartmentEdit, "name") || null, invalid: false}
  });
  const [mainButtonDisabled, setButtonDisabled] = useState(false);
  // Methods
  const onChangeHandler = ({target}) => {
    if(target.name === "departmentName"){
      setFormField({...formField, [target.name]: {value: target.value, invalid: isEmpty(target.value)}});
    }
  };
  const checkFormThenSubmit = async () => {
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      setButtonDisabled(true);
      try{
        const awaitUpdateDepartment = await updateDepartment({
          name: newFormField.departmentName.value
        }, selectedDepartmentEdit.id);
        if(awaitUpdateDepartment.updatedAt){
          onClickClose({type: "editDepartment", uid: uuid()});
        }
      }catch(err){
        // console.error(err);
        setButtonDisabled(false);
      }
    }else{
      setFormField(newFormField);
    }
  };
  const deleteDepartmentHandler = () => {
    if(!verifyDelete){
      setVerifyStatus(!verifyDelete);
    }else{
      deleteDepartment(selectedDepartmentEdit.id).then(res => {
        if(res.deletedAt){
          onClickClose({type: "deleteDepartment", uid: uuid()});
        }
      });
    }
  };
  // Render
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="departmentGroup.editDepartment"/>
        <button className="close-button" onClick={() => onClickClose({type: "editDepartment", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody className="edit-department">
        <FormGroup>
          <label>
            <Translator id="departmentGroup.departmentName"/>
          </label>
          <FormInput
            name="departmentName"
            onChange={onChangeHandler}
            value={formField.departmentName.value}
            invalid={formField.departmentName.invalid}/>
          {formField.departmentName.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.fieldEmptyInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <ButtonShards theme="danger" className="custom-button" onClick={deleteDepartmentHandler}>
          {verifyDelete ? <Translator id="warning.verifyAction"/> : <Translator id="commonGroup.remove"/>}
        </ButtonShards>
        <ButtonShards
          className="custom-button"
          disabled={mainButtonDisabled}
          onClick={checkFormThenSubmit}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </ModalFooter>
    </React.Fragment>
  )
};

export default Department