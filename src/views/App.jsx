import React from "react";
import Loadable from "react-loadable";
import {Router, Route} from "react-router-dom";
import {Provider} from "react-redux";

import "./app.scss";
import "shards-ui/dist/css/shards.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
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
  return(
    <Provider store={store}>
      <Router history={history}>
        <Route path="/" component={Home}/>
        <Route exact path="/auth" component={Auth}/>
      </Router>
    </Provider>
  )
};

export default App