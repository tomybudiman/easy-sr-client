import axios from "axios";
import Cookies from "js-cookie";

import store from "../../state";
import history from "../../utils/history";
import {setAuthToken} from "../../state/actions";

const refreshTokenMethod = () => {
  const tokenExpires = 3600;
  const refreshDelay = 300;
  setTimeout(() => {
    const {authToken} = store.getState().reducerAuth;
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/auth/refresh_token`,
      headers: {"Authorization": `Bearer ${authToken}`}
    }).then(({data}) => {
      store.dispatch(setAuthToken(data.token));
      Cookies.set("UID", data.token);
      refreshTokenMethod();
    }).catch(err => {
      console.error(err);
      if(err.response.status === 401){
        logoutMethod();
      }
    });
  }, (tokenExpires - refreshDelay) * 1000);
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
      store.dispatch(setAuthToken(data.token));
      Cookies.set("UID", data.token);
      refreshTokenMethod();
      resolve(data);
    }).catch(err => {
      console.error(err);
      reject(err);
    });
  });
};