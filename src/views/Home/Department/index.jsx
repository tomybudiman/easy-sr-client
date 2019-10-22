import React, {useState, Component} from "react";
import MaterialTable from "material-table";
import {FormGroup, FormInput, ModalBody, ModalFooter, ModalHeader, Button as ButtonShards} from "shards-react";
import Button from "@material-ui/core/Button";
import uuid from "uuidv4";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

class Department extends Component {
  constructor(props){
    super(props);
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
    return(
      <React.Fragment>
        <PageRouteHeader>
          <Translator id="departmentGroup.department"/>
        </PageRouteHeader>
        <MaterialTable
          style={tableStyle}
          options={tableOptions}
          columns={tableColumns}
          components={tableComponents}/>
      </React.Fragment>
    )
  }
}

export const CreateDepartmentModal = ({onClickClose}) => {
  const [formField, setFormField] = useState({
    departmentName: {value: "", isValid: true},
    departmentId: {value: "", isValid: true}
  });
  const updateFormField = ({target}) => {
    const idValue = value => {
      return value.trim().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
    };
    const createObj = (baseObj = formField, key, value) => ({
      ...baseObj,
      [key || target.name]: {
        ...baseObj[key || target.name],
        value: value || target.value
      }
    });
    if(formField[target.name].isValid){
    }else{
    }
    switch(target.name){
      case "departmentName":
        const value = target.value.trim().replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s/g, "_").toLowerCase();
        setFormField(createObj(createObj(), "departmentId", value));
        break;
      case "departmentId":
      default:
        setFormField(createObj(createObj(), target.name, target.value));
        break;
    }
  };
  const checkFormThenSubmit = () => {};
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
            invalid={!formField.departmentName.isValid}
            onChange={updateFormField}/>
        </FormGroup>
        <FormGroup className="input-new-department-id">
          <label htmlFor="input-new-department-id">
            <Translator id="departmentGroup.departmentId"/>
          </label>
          <FormInput
            name="departmentId"
            id="input-new-department-id"
            value={formField.departmentId.value}
            invalid={!formField.departmentId.isValid}
            onChange={updateFormField}/>
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