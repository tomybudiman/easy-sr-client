import axios from "axios";
import get from "lodash/get";
import {NotificationManager} from "react-notifications";

import store from "../../../state";
import {logoutMethod} from "../../Auth/fetch";
import {handleError} from "../../../utils/utils";
import {localeData} from "../../../components/Translator";

export const updateUserPassword = payload => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API_HOST}/auth/change_password`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      data: JSON.stringify(payload)
    }).then(({data}) => {
      const errMsg = get(localeData[store.getState().reducerLocale.locale], "success.success");
      NotificationManager.success(errMsg, null, 2000);
      resolve(data);
      setTimeout(logoutMethod, 2000);
    }).catch(err => handleError(err, reject, {
      errMsg: get(localeData[store.getState().reducerLocale.locale], "warning.passwordCheck")
    }));
  });
};