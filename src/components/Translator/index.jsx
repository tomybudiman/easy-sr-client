import "react";
import {get} from "lodash";

import store from "../../state";
import id from "../../data/lang/id";
import en from "../../data/lang/en";

const localeData = {id, en};

const Translator = ({id}) => {
  const {locale} = store.getState().reducerLocale;
  return get(localeData[locale], id) || id;
};

export default Translator