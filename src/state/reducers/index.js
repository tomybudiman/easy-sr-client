import {combineReducers} from "redux";

import reducerAuth from "./reducerAuth";
import reducerLocale from "./reducerLocale";
import reducerRouteUser from "./reducerRouteUser";
import reducerRouteDepartment from "./reducerRouteDepartment";

const rootReducer = combineReducers({reducerLocale, reducerAuth, reducerRouteUser, reducerRouteDepartment});

export default rootReducer