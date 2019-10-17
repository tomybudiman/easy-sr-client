import {connect} from "react-redux";
import {get} from "lodash";

import id from "../../data/lang/id";
import en from "../../data/lang/en";

export const localeData = {id, en};

const Translator = (props) => {
  return get(localeData[props.locale], props.id) || props.id;
};

export default connect(state => ({
  locale: state.reducerLocale.locale
}), null)(Translator);