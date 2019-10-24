import React, {Fragment} from "react";
import {ModalHeader, ModalBody, ModalFooter} from "shards-react";
import MaterialTable, {MTableToolbar} from "material-table";
import Button from "@material-ui/core/Button";
import uuid from "uuidv4";

import {getSurveys} from "./fetch";
import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

export const CreateMaterialityModal = ({onClickClose}) => {
  return(
    <React.Fragment>
      <ModalHeader className="home-modal-header" tag="div">
        <Translator id="surveyGroup.createMateriality"/>
        <button className="close-button" onClick={() => onClickClose({type: "createMateriality", uid: uuid()})}>
          <i className="fas fa-times"/>
        </button>
      </ModalHeader>
      <ModalBody></ModalBody>
      <ModalFooter></ModalFooter>
    </React.Fragment>
  )
};

const Materiality = ({onClickEvent}) => {
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false,
    search: false
  };
  const tableComponents = {
    Toolbar: () => (
      <div className="survey-datatable-toolbar">
        <Button size="small" onClick={e => onClickEvent({e, data: {id: "createMateriality"}})}>
          <Translator id="surveyGroup.createMateriality"/>
        </Button>
      </div>
    )
  };
  const data = query => {
  };
  return(
    <Fragment>
      <PageRouteHeader>
        <Translator id="surveyGroup.materialitySurvey"/>
      </PageRouteHeader>
      <MaterialTable
        style={tableStyle}
        options={tableOptions}
        components={tableComponents}/>
    </Fragment>
  )
};

export default Materiality