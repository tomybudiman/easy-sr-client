import React, {useState, Component} from "react";
import MaterialTable from "material-table";
import {FormGroup, FormInput, FormFeedback, ModalBody, ModalFooter, ModalHeader, Button as ButtonShards} from "shards-react";
import Button from "@material-ui/core/Button";
import {get, isEmpty} from "lodash";
import uuid from "uuidv4";

import Translator from "../../../components/Translator";
import {getDepartments, createDepartment} from "./fetch";
import PageRouteHeader from "../../../components/PageRouteHeader";

class Department extends Component {
  constructor(props){
    super(props);
    this.tableRef = null;
  }
  // Component Lifecycle
  componentDidUpdate(prevProps){
    if(get(prevProps, "prevEvent.uid") !== get(this.props, "prevEvent.uid")){
      if(get(this.props, "prevEvent.type") === "createDepartment"){
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
      {title: "ID", field: "id", filtering: false, sorting: false}
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
  const updateFormField = ({target}) => {
    if(Object.keys(formField).includes(target.name)){
      const value = target.value.trim().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
      setFormField({...formField, [target.name]: {value, invalid: isEmpty(value)}});
    }
  };
  const checkFormThenSubmit = () => {
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      createDepartment({name: formField.departmentName.value}).then(res => {
        if(res.name === formField.departmentName.value){
          onClickClose({type: "createDepartment", uid: uuid()});
        }
      });
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
        <ButtonShards className="custom-button" onClick={() => checkFormThenSubmit()}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </ModalFooter>
    </React.Fragment>
  )
};

export default Department