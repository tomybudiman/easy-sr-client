import React, {useState} from "react";
import MaterialTable, {MTableToolbar} from "material-table";
import {FormGroup, FormInput, ModalBody, ModalFooter, ModalHeader, Button as ButtonShards} from "shards-react";
import useStateWithCallback from "use-state-with-callback";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";
import Button from "@material-ui/core/Button";

const Department = ({onClickEvent}) => {
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false
  };
  const tableColumns = [
    {title: "Name", field: "name"},
    {title: "ID", field: "id"}
  ];
  const tableComponents = {
    Toolbar: props => (
      <React.Fragment>
        <MTableToolbar {...props}/>
        <div className="department-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createDepartment"}})}>
            <Translator id="departmentGroup.createNewDepartment"/>
          </Button>
        </div>
      </React.Fragment>
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
};

export const CreateDepartmentModal = () => {
  // const preFormatString = departmentName.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  // const formattedId = preFormatString.replace(/\s/g, "_").toLowerCase();
  const [formField, setFormField] = useState({
    departmentName: {value: "", isValid: true},
    departmentId: {value: "", isValid: true}
  });
  const updateFormField = ({target}) => {
    const baseObjValue = {
      ...formField,
      [target.name]: {
        ...formField[target.name],
        value: target.value
      }
    };
    if(formField[target.name].isValid){
    }else{
    }
    switch(target.name){
      case "departmentName":
      case "departmentId":
      default:
          break;
    }
  };
  const checkFormThenSubmit = () => {};
  return(
    <React.Fragment>
      <ModalHeader>
        <Translator id="departmentGroup.createNewDepartment"/>
      </ModalHeader>
      <ModalBody>
        <FormGroup className="input-new-department-name">
          <label htmlFor="input-new-department-name">
            <Translator id="departmentGroup.departmentName"/>
          </label>
          <FormInput
            name="departmentName"
            id="input-new-department-name"
            value={formField.departmentName.value}
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