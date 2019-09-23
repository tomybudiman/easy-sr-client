import {combineReducers} from "redux";

import reducerAuth from "./reducerAuth";
import reducerLocale from "./reducerLocale";

const rootReducer = combineReducers({reducerLocale, reducerAuth});

export default rootReducer