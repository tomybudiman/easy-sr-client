import React from "react";
import Loadable from "react-loadable";
import {Router, Route, Redirect, Switch} from "react-router-dom";
import {Provider} from "react-redux";
import Cookies from "js-cookie";

import "./app.scss";
import "shards-ui/dist/css/shards.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import {setAuthToken} from "../state/actions";
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

const App = () => {
  const rootRoute = history.location.pathname.slice(1).split("/")[0];
  if(Cookies.get("UID")){
    store.dispatch(setAuthToken(Cookies.get("UID")));
    if(rootRoute !== "dashboard"){
      history.replace({pathname: "/dashboard"});
    }
  }
  return(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/dashboard"/>
          )}/>
          <Route path="/dashboard" component={Home}/>
          <Route exact path="/auth" component={Auth}/>
        </Switch>
      </Router>
    </Provider>
  )
};

export default App