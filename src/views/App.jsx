import React, {Fragment, useState} from "react";
import {Router, Route, Redirect, Switch} from "react-router-dom";
import {NotificationContainer} from "react-notifications";
import Loadable from "react-loadable";
import {Provider} from "react-redux";
import Cookies from "js-cookie";

import "./app.scss";
import "shards-ui/dist/css/shards.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-notifications/lib/notifications.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {refreshTokenMethod} from "./Auth/fetch";
import history from "../utils/history";
import store from "../state";

const Home = Loadable({
  loader: () => import("./Home"),
  loading: () => <React.Fragment/>,
});

const Auth = Loadable({
  loader: () => import("./Auth"),
  loading: () => <React.Fragment/>,
});

const ValidateAuthComponent = ({Component}) => {
  const [tokenVerified, setTokenVerified] = useState(null);
  store.subscribe(() => setTokenVerified(store.getState().reducerAuth.tokenVerified));
  switch(Cookies.get("UID") ? tokenVerified : false){
    case null:
      return <Fragment/>;
    case true:
      if(history.location.pathname === "/auth"){
        return <Redirect to="/dashboard"/>
      }else{
        return <Component/>;
      }
    default:
      if(history.location.pathname === "/auth"){
        return <Component/>
      }else{
        return <Redirect to="/auth"/>;
      }
  }
};

const App = () => {
  if(Cookies.get("UID")){
    refreshTokenMethod(Cookies.get("UID"), true);
  }
  return(
    <Fragment>
      <NotificationContainer/>
      <Provider store={store}>
        <Router history={history}>
          <Switch>
            <Route exact path="/" render={() => (
              <Redirect to="/dashboard"/>
            )}/>
            <Route path="/dashboard" render={() => <ValidateAuthComponent Component={Home}/>}/>
            <Route exact path="/auth" render={() => <ValidateAuthComponent Component={Auth}/>}/>
          </Switch>
        </Router>
      </Provider>
    </Fragment>
  )
};

export default App