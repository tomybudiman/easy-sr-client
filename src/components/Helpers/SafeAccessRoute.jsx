import React from "react";
import {Route, Redirect} from "react-router-dom";
import {get, intersection, difference} from "lodash";

import store from "../../state";
import {getRoutes} from "../../utils/utils";

const appRoutes = getRoutes();

const SafeAccessRoute = (props) => {
  const propsRules = ["exact", "path", "render", "component"];
  const authRoles = store.getState().reducerAuth.userTokenData.roles;
  const sessionScope = store.getState().reducerAuth.userTokenData.scope;
  const routeCheck = appRoutes.filter(each => each.path && each.path.replace(/\/+$/, "") === props.path);
  const currentRoute = get(routeCheck[0], "roles") || [];
  const isAuthScopeValid = currentRoute.includes(true) || difference(currentRoute, sessionScope).length !== currentRoute.length;
  const excludeRouteRoles = get(routeCheck[0], "excludeRoles.roles") || [];
  const isAuthScopeAllowed = difference(excludeRouteRoles, authRoles).length === excludeRouteRoles.length;
  if(routeCheck.length > 0 && isAuthScopeValid && isAuthScopeAllowed){
    const newProps = intersection(Object.keys(props), propsRules).reduce((prevObj, itrValue) => ({...prevObj, [itrValue]: props[itrValue]}), {});
    return <Route {...newProps}/>
  }else{
    return <Redirect to={get(routeCheck[0], "excludeRoles.redirect") || "/dashboard/unauthorized"}/>
  }
};

export default SafeAccessRoute