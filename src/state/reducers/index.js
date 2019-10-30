import {combineReducers} from "redux";

import reducerAuth from "./reducerAuth";
import reducerLocale from "./reducerLocale";
import reducerRouteUser from "./reducerRouteUser";
import reducerRouteIndustry from "./reducerRouteIndustry";
import reducerRouteDepartment from "./reducerRouteDepartment";

const rootReducer = combineReducers({reducerLocale, reducerAuth, reducerRouteUser, reducerRouteIndustry, reducerRouteDepartment});

export default rootReducer