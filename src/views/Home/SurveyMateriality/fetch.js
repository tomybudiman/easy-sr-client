import axios from "axios";

import store from "../../../state";
import {handleError} from "../../../utils/utils";

export const getSurveys = () => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/survey`,
      headers: {"Authorization": `Bearer ${authToken}`}
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};

export const startSurvey = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/survey/start`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      data: JSON.stringify(payload)
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};