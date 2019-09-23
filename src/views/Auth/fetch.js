import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";

import store from "../../state";
import history from "../../utils/history";
import {setAuthToken} from "../../state/actions";

export const refreshTokenMethod = (token) => {
  const tokenExpires = moment.unix(readTokenData(token).exp).diff(moment(), "s");
  const refreshDelay = 300; // In seconds
  if((tokenExpires - refreshDelay) * 1000 <= 2147483647){
    setTimeout(() => {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_HOST}/auth/refresh_token`,
        headers: {"Authorization": `Bearer ${token}`}
      }).then(({data}) => {
        store.dispatch(setAuthToken(data.token));
        Cookies.set("UID", data.token);
        refreshTokenMethod(data.token);
      }).catch(err => {
        console.error(err);
        if(err.response.status === 401){
          logoutMethod();
        }
      });
    }, (tokenExpires - refreshDelay) * 1000);
  }
};

export const readTokenData = (token) => {
  return JSON.parse(Buffer.from(token.split(".")[1], 'base64').toString('ascii'));
};

export const logoutMethod = () => {
  console.log("Signing out...");
  const {authToken} = store.getState().reducerAuth;
  axios({
    method: "POST",
    url: `${process.env.REACT_APP_API_HOST}/auth/logout`,
    headers: {"Authorization": `Bearer ${authToken}`}
  }).then(({data}) => {
    if(data.success){
      // If logout success
    }
  }).catch(err => {
    console.error(err);
  }).finally(() => {
    store.dispatch(setAuthToken(null));
    Cookies.remove("UID");
    history.replace({
      search: "?type=login",
      pathname: "/auth"
    });
  });
};

export const loginMethod = (email, password) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/auth/login`,
      headers: {"Content-Type": "application/json"},
      data: JSON.stringify({email, password})
    }).then(({data}) => {
      Cookies.set("UID", data.token, {expires: new Date(readTokenData(data.token).exp * 1000)});
      store.dispatch(setAuthToken(data.token));
      refreshTokenMethod(data.token);
      resolve(data);
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
};