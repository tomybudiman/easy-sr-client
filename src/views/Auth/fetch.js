import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import get from "lodash/get";
import moment from "moment";
import axios from "axios";

import store from "../../state";
import history from "../../utils/history";
import {setAuthToken, setTokenVerified} from "../../state/actions";
import {NotificationManager} from "react-notifications";

const generateNewToken = (data) => {
  const tokenExpiryTime = 3600;
  const expiryTime = Math.floor(Date.now() / 1000) + tokenExpiryTime;
  return {
    token: jwt.sign({exp: expiryTime, data: data}, process.env.REACT_APP_JWT_SECRET),
    expiryTime
  };
};

export const refreshTokenMethod = (token, verify = false) => {
  const tokenExpires = moment.unix(readTokenData(token).exp).diff(moment(), "s");
  const refreshDelay = 300; // In seconds
  const axiosFetch = () => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/auth/refresh_token`,
      headers: {"Authorization": `Bearer ${readTokenData(token).data}`}
    }).then(({data}) => {
      const {token, expiryTime} = generateNewToken(data.token);
      Cookies.set("UID", token, {expires: new Date(expiryTime * 1000)});
      store.dispatch(setTokenVerified(true));
      store.dispatch(setAuthToken(data.token));
      refreshTokenMethod(token);
    }).catch(err => {
      console.error(err);
      if(err.response.status === 401){
        logoutMethod();
      }
    });
  };
  if(verify){
    axiosFetch();
  }else{
    setTimeout(axiosFetch, (tokenExpires - refreshDelay) * 1000);
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
      const {token, expiryTime} = generateNewToken(data.token);
      Cookies.set("UID", token, {expires: new Date(expiryTime * 1000)});
      store.dispatch(setTokenVerified(true));
      store.dispatch(setAuthToken(data.token));
      refreshTokenMethod(token);
      resolve(data);
    }).catch(err => {
      NotificationManager.error(get(err, "response.data.message") || "Network error!");
      console.error(err);
      reject(err);
    });
  });
};