import axios from "axios";

import store from "../../../state";
import {handleError} from "../../../utils/utils";

export const getDepartments = () => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/department`,
      headers: {"Authorization": `Bearer ${authToken}`}
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};

export const createDepartment = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/department`,
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

export const updateDepartment = (payload, id) => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API_HOST}/department/${id}`,
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

export const deleteDepartment = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "DELETE",
      url: `${process.env.REACT_APP_API_HOST}/department/${payload}`,
      headers: {"Authorization": `Bearer ${authToken}`},
    }).then(({data}) => {
      resolve(data);
    }).catch(err => handleError(err, reject));
  });
};