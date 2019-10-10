import {combineReducers} from "redux";

import reducerAuth from "./reducerAuth";
import reducerLocale from "./reducerLocale";
import reducerRouteUser from "./reducerRouteUser";

const rootReducer = combineReducers({reducerLocale, reducerAuth, reducerRouteUser});

export default rootReducer