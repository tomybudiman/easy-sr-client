import React from "react";

import {testFetch} from "./fetch";

class SurveyForm extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount(){
    testFetch();
  }
  render(){
    return(
      <div className="survey-container"></div>
    )
  }
};

export default SurveyForm