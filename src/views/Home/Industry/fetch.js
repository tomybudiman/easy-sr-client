import axios from "axios";

import store from "../../../state";
import {handleError} from "../../../utils/utils";

export const getIndustry = () => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/industry`,
      headers: {"Authorization": `Bearer ${authToken}`},
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};

export const createIndustry = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/industry`,
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

export const deleteIndustry = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_HOST}/industry/${payload}`,
      headers: {"Authorization": `Bearer ${authToken}`},
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};

export const updateIndustry = (payload, id) => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_HOST}/industry/${id}`,
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