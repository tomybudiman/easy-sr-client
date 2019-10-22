import {NotificationManager} from "react-notifications";
import get from "lodash/get";

import {logoutMethod} from "../views/Auth/fetch";

export const readUrlQueryValue = name => {
  const url = window.location.href;
  name = name.replace(/[[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const result = regex.exec(url);
  if(!result){
    return null
  }
  if(!result[2]){
    return ''
  }
  return decodeURIComponent(result[2].replace(/\+/g, ' '));
};

export const handleError = (err, reject, opt = {}) => {
  console.error(err);
  if(get(err, "response.status") === 401){
    logoutMethod();
  }else{
    NotificationManager.error(opt.errMsg || get(err, "response.data.message") || "Network error!");
    reject(err);
  }
};