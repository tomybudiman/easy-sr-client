import React, {Component, Fragment} from "react";
import {
  ModalHeader, ModalBody, ModalFooter, FormGroup, FormInput, FormSelect, Button as ButtonShards, FormFeedback
} from "shards-react";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import {isEmpty, get} from "lodash";
import moment from "moment";
import uuid from "uuidv4";

import {getIndustry} from "../Industry/fetch";
import Translator from "../../../components/Translator";
import {getSurveys, startSurvey, endSurvey} from "./fetch";
import PageRouteHeader from "../../../components/PageRouteHeader";

export class CreateMaterialityModal extends Component {
  constructor(props){
    super(props);
    this.mounted = false;
    this.state = {
      industryData: null,
      buttonDisabled: false,
      formField: {
        surveyName: {value: null, invalid: false},
        industryId: {value: null, invalid: false}
      }
    };
    this.onChangeHandle = this.onChangeHandle.bind(this);
    this.checkFormThenSubmit = this.checkFormThenSubmit.bind(this);
  }
  // Methods
  onChangeHandle({target}){
    if(Object.keys(this.state.formField).includes(target.name)){
      const objValue = target.name === "industryId"
        ? {value: target.value === "default" ? null : target.value, invalid: isEmpty(target.value === "default" ? null : target.value)}
        : {value: target.value, invalid: isEmpty(target.value)};
      this.setState({formField: {
        ...this.state.formField, [target.name]: objValue
      }});
    }
  }
  async checkFormThenSubmit(){
    const {formField} = this.state;
    const {onClickClose} = this.props;
    const newFormField = Object.keys(formField).reduce((prevObj, itrVal) => {
      return {...prevObj, [itrVal]: {...formField[itrVal], invalid: isEmpty(formField[itrVal].value)}}
    }, {});
    const isFormValid = Object.values(newFormField).filter(({value, invalid}) => isEmpty(value) || invalid).length === 0;
    if(isFormValid){
      this.setState({buttonDisabled: true});
      try{
        const awaitStartSurvey = await startSurvey({
          title: formField.surveyName.value,
          industry_id: formField.industryId.value
        });
        if(get(awaitStartSurvey, "survey.createdAt")){
          onClickClose({type: "startSurvey", uid: uuid()});
        }
      }catch(err){
        // console.error(err);
        this.setState({buttonDisabled: false});
      }
    }else{
      this.setState({formField: newFormField});
    }
  }
  // Component lifecycle
  componentDidMount(){
    this.mounted = true;
    getIndustry().then(({rows}) => {
      if(this.mounted){
        this.setState({industryData: rows})
      }
    });
  }
  componentWillUnmount(){
    this.mounted = false;
  }
  render(){
    const {onClickClose} = this.props;
    return(
      <React.Fragment>
        <ModalHeader className="home-modal-header" tag="div">
          <Translator id="surveyGroup.createMateriality"/>
          <button className="close-button" onClick={() => onClickClose({type: "createMateriality", uid: uuid()})}>
            <i className="fas fa-times"/>
          </button>
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <label htmlFor="input-new-materiality-survey-name">
              <Translator id="surveyGroup.surveyName"/>
            </label>
            <FormInput
              name="surveyName"
              onChange={this.onChangeHandle}
              id="input-new-materiality-survey-name"
              invalid={this.state.formField.surveyName.invalid}/>
            {this.state.formField.surveyName.invalid ? (
              <FormFeedback tag="p" valid={false}>
                <Translator id="warning.fieldEmptyInvalid"/>
              </FormFeedback>
            ) : null}
          </FormGroup>
          <FormGroup>
            <label htmlFor="input-new-materiality-survey-industry">
              <Translator id="industryGroup.industry"/>
            </label>
            <FormSelect
              name="industryId"
              onChange={this.onChangeHandle}
              id="input-new-materiality-survey-industry"
              invalid={this.state.formField.industryId.invalid}>
              {this.state.industryData ? (
                <React.Fragment>
                  <option value={"default"}>Select Industry</option>
                  {this.state.industryData.map((each, i) => (
                    <option value={each.id} key={i}>{each.name}</option>
                  ))}
                </React.Fragment>
              ) : (
                <option><Translator id="commonGroup.empty"/></option>
              )}
            </FormSelect>
            {this.state.formField.industryId.invalid ? (
              <FormFeedback tag="p" valid={false}>
                <Translator id="warning.fieldEmptyInvalid"/>
              </FormFeedback>
            ) : null}
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <ButtonShards className="custom-button" disabled={this.state.buttonDisabled} onClick={this.checkFormThenSubmit}>
            <Translator id="commonGroup.save"/>
          </ButtonShards>
        </ModalFooter>
      </React.Fragment>
    )
  }
}

class Materiality extends Component {
  constructor(props){
    super(props);
    this.tableRef = null;
    this.data = this.data.bind(this);
  }
  // Methods
  async endSurveyHandle(raw){
    const awaitEndSurvey = await endSurvey(raw.id);
    if(awaitEndSurvey.success){
      setTimeout(this.tableRef.onQueryChange, 0);
    }
  }
  data(query){
    return new Promise(resolve => {
      getSurveys().then(res => {
        resolve({
          data: res.rows.map(each => ({
            raw: each,
            formatted: {
              surveyName: each.title,
              status: each.status,
              createdAt: each.createdAt
            }
          })),
          page: res.page - 1,
          totalCount: res.count
        })
      });
    });
  };
  // Component Lifecycle
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
      {title: "Survey Name", filtering: false, sorting: false, render: ({formatted}) => formatted.surveyName},
      {title: "Status", filtering: false, sorting: false, render: ({formatted}) => formatted.status},
      {title: "Created At", filtering: false, sorting: false, render: ({formatted}) => {
          return moment(formatted.createdAt).format("DD MMMM YYYY HH:mm");
        }},
      {title: "Action", filtering: false, sorting: false, render: ({raw}) => {
          return(
            <Button className="datatable-action-button" title="End Survey" onClick={() => this.endSurveyHandle(raw)}>
              <i className="fas fa-stop-circle"/>
            </Button>
          )
        }}
    ];
    const tableComponents = {
      Toolbar: () => (
        <div className="survey-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createMateriality"}})}>
            <Translator id="surveyGroup.createMateriality"/>
          </Button>
        </div>
      )
    };
    return(
      <Fragment>
        <PageRouteHeader>
          <Translator id="surveyGroup.materialitySurvey"/>
        </PageRouteHeader>
        <MaterialTable
          data={this.data}
          style={tableStyle}
          columns={tableColumns}
          options={tableOptions}
          components={tableComponents}
          tableRef={e => this.tableRef = e}/>
      </Fragment>
    )
  }
}

export default Materiality