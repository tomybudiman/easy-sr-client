import React, {Component, useState} from "react";
import {
  Button as ButtonShards, FormFeedback, FormGroup, FormInput, ModalBody, ModalFooter, ModalHeader
} from "shards-react";
import MaterialTable from "material-table";
import Button from "@material-ui/core/Button";
import {isEmpty, get} from "lodash";
import moment from "moment";
import uuid from "uuidv4";

import store from "../../../state";
import Translator from "../../../components/Translator";
import {setSelectedIndustryEdit} from "../../../state/actions";
import PageRouteHeader from "../../../components/PageRouteHeader";
import {getIndustry, createIndustry, deleteIndustry, updateIndustry} from "./fetch";

export const CreateIndustryModal = ({onClickClose}) => {
  const [formField, setFormField] = useState({
    industryName: {value: "", invalid: false}
  });
  const updateFormField = ({target}) => {
    if(Object.keys(formField).includes(target.name)){
      setFormField({...formField, [target.name]: {value: target.value, invalid: isEmpty(target.value)}});
    }
  };
  const checkFormThenSubmit = () => {
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      createIndustry({name: formField.industryName.value}).then(res => {
        if(res.createdAt){
          onClickClose({type: "createIndustry", uid: uuid()});
        }
      });
    }else{
      setFormField(newFormField);
    }
  };
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="industryGroup.createNewIndustry"/>
        <button className="close-button" onClick={() => onClickClose({type: "createIndustry", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody>
        <FormGroup className="input-new-industry-name">
          <label htmlFor="input-new-industry-name">
            <Translator id="industryGroup.industryName"/>
          </label>
          <FormInput
            name="industryName"
            id="input-new-industry-name"
            invalid={formField.industryName.invalid}
            onChange={updateFormField}/>
          {formField.industryName.invalid ? (
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

export const EditIndustryModal = ({onClickClose}) => {
  const {selectedIndustryEdit} = store.getState().reducerRouteIndustry;
  const [verifyDelete, setVerifyStatus] = useState(false);
  const [formField, setFormField] = useState({
    industryName: {value: get(selectedIndustryEdit, "name") || null, invalid: false}
  });
  // Methods
  const onChangeHandler = ({target}) => {
    if(target.name === "industryName"){
      setFormField({...formField, [target.name]: {value: target.value, invalid: isEmpty(target.value)}});
    }
  };
  const checkFormThenSubmit = () => {
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      updateIndustry({
        name: newFormField.industryName.value
      }, selectedIndustryEdit.id).then(res => {
        if(res.updatedAt){
          onClickClose({type: "editIndustry", uid: uuid()});
        }
      });
    }else{
      setFormField(newFormField);
    }
  };
  const deleteIndustryHandler = () => {
    if(!verifyDelete){
      setVerifyStatus(!verifyDelete);
    }else{
      deleteIndustry(selectedIndustryEdit.id).then(res => {
        if(res.deletedAt){
          onClickClose({type: "deleteIndustry", uid: uuid()});
        }
      });
    }
  };
  // Render
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="industryGroup.editIndustry"/>
        <button className="close-button" onClick={() => onClickClose({type: "editIndustry", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody className="edit-industry">
        <FormGroup>
          <label>
            <Translator id="industryGroup.industryName"/>
          </label>
          <FormInput
            name="industryName"
            onChange={onChangeHandler}
            value={formField.industryName.value}
            invalid={formField.industryName.invalid}/>
          {formField.industryName.invalid ? (
            <FormFeedback tag="p" valid={false}>
              <Translator id="warning.fieldEmptyInvalid"/>
            </FormFeedback>
          ) : null}
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <ButtonShards theme="danger" className="custom-button" onClick={deleteIndustryHandler}>
          {verifyDelete ? <Translator id="warning.verifyAction"/> : <Translator id="commonGroup.remove"/>}
        </ButtonShards>
        <ButtonShards className="custom-button" onClick={checkFormThenSubmit}>
          <Translator id="commonGroup.save"/>
        </ButtonShards>
      </ModalFooter>
    </React.Fragment>
  )
};

class Industry extends Component {
  constructor(props){
    super(props);
    this.tableRef = null;
    this.data = this.data.bind(this);
  }
  data(query){
    return new Promise(resolve => {
      getIndustry().then(res => {
        resolve({
          data: res.rows.map(each => ({
            raw: each,
            formatted: {
              industry: each.name,
              createdAt: each.createdAt
            }
          })),
          page: res.page - 1,
          totalCount: res.count
        });
      });
    });
  }
  // Component lifecycle
  componentDidUpdate(prevProps){
    if(get(prevProps, "prevEvent.uid") !== get(this.props, "prevEvent.uid")){
      const arrOfEvents = ["createIndustry", "editIndustry", "deleteIndustry"];
      if(arrOfEvents.includes(get(this.props, "prevEvent.type"))){
        setTimeout(this.tableRef.onQueryChange, 0);
      }
    }
  }
  // Render
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
      {title: "Industry", filtering: false, sorting: false, render: ({formatted}) => formatted.industry},
      {title: "Created At", filtering: false, sorting: false, render: ({formatted}) => {
          return moment(formatted.createdAt).format("DD MMMM YYYY HH:mm");
        }},
      {title: "Action", render: ({raw}) => (
          <Button className="datatable-action-button" onClick={e => {
            store.dispatch(setSelectedIndustryEdit(raw));
            onClickEvent({e, data: {id: "editIndustry"}});
          }}>
            <i className="fas fa-user-cog"/>
          </Button>
      ), filtering: false, sorting: false}
    ];
    const tableComponents = {
      Toolbar: () => (
        <div className="industry-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createIndustry"}})}>
            <Translator id="industryGroup.createNewIndustry"/>
          </Button>
        </div>
      )
    };
    return (
      <React.Fragment>
        <PageRouteHeader>
          <Translator id="industryGroup.industry"/>
        </PageRouteHeader>
        <MaterialTable
          data={this.data}
          style={tableStyle}
          columns={tableColumns}
          options={tableOptions}
          components={tableComponents}
          tableRef={e => this.tableRef = e}/>
      </React.Fragment>
    )
  }
}

export default Industry