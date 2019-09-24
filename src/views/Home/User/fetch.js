import axios from "axios";
import get from "lodash/get";
import {NotificationManager} from "react-notifications";

import store from "../../../state";
import {logoutMethod} from "../../Auth/fetch";

export const getUsers = () => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/auth/users`,
      headers: {"Authorization": `Bearer ${authToken}`}
    }).then(({data}) => {
      resolve(data);
    }).catch(err => {
      console.error(err);
      if(get(err, "response.status") === 401){
        logoutMethod();
      }else{
        NotificationManager.error(get(err, "response.data.message") || "Network error!");
        reject(err);
      }
    });
  });
};

export const createUser = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/auth/create_user`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      data: JSON.stringify(payload)
    }).then(({data}) => {
      resolve(data);
    }).catch(err => {
      console.error(err);
      if(get(err, "response.status") === 401){
        logoutMethod();
      }else{
        NotificationManager.error(get(err, "response.data.message") || "Network error!");
        reject(err);
      }
    });
  });
};