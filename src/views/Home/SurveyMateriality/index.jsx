import React, {Fragment} from "react";
import MaterialTable, {MTableToolbar} from "material-table";

import {getSurveys} from "./fetch";
import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

const Materiality = () => {
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false,
    search: false
  };
  const data = query => {
    getSurveys().then(res => {
      console.log(res);
    });
  };
  return(
    <Fragment>
      <PageRouteHeader>
        <Translator id="surveyGroup.materialitySurvey"/>
      </PageRouteHeader>
      <MaterialTable
        data={data}
        style={tableStyle}
        options={tableOptions}/>
    </Fragment>
  )
};

export default Materiality