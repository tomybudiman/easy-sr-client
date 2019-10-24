import React from "react";
import {Route, Redirect} from "react-router-dom";
import difference from "lodash/difference";
import intersection from "lodash/intersection";

import store from "../../state";
import {getRoutes} from "../../utils/utils";

const appRoutes = getRoutes();

const SafeAccessRoute = (props) => {
  const propsRules = ["exact", "path", "render", "component"];
  const sessionScope = store.getState().reducerAuth.userTokenData.scope;
  const routeCheck = appRoutes.filter(each => each.path === props.path);
  const currentRoute = routeCheck[0];
  const isAuthScopeValid = currentRoute.roles.includes(true) || difference(currentRoute.roles, sessionScope).length !== currentRoute.roles.length;
  if(routeCheck.length > 0 && isAuthScopeValid){
    const newProps = intersection(Object.keys(props), propsRules).reduce((prevObj, itrValue) => ({...prevObj, [itrValue]: props[itrValue]}), {});
    return <Route {...newProps}/>
  }else{
    return <Redirect to="/dashboard/unauthorized"/>
  }
};

export default SafeAccessRoute