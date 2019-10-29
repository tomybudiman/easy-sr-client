import axios from "axios";

import store from "../../../state";
import {handleError} from "../../../utils/utils";

export const testFetch = () => {
  const {authToken} = store.getState().reducerAuth;
  return new Promise((resolve, reject) => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API_HOST}/survey`,
      headers: {"Authorization": `Bearer ${authToken}`},
    }).then(({data}) => {
      console.log(data);
    }).catch(err => handleError(err, reject));
  });
};