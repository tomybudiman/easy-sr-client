import React from "react";
import {Link} from "react-router-dom";
import get from "lodash/get";

import "./index.scss";
import store from "../../state";
import Translator from "../Translator";
import history from "../../utils/history";
import {logoutMethod} from "../../views/Auth/fetch";

const DashboardAppbar = () => {
  const user = {
    ...get(store.getState().reducerAuth, "userTokenData.user") || {},
    roles: get(store.getState().reducerAuth, "userTokenData.roles") || []
  };
  const isSuperadmin = user.roles.includes("superadmin");
  const rootRoute = history.location.pathname.match(/^\/[^/]+/)[0];
  // Methods
  const getSimpleName = () => {
    if(user.fullname){
      const splitFullname = user.fullname.split(" ").map(each => each.slice(0, 1));
      return splitFullname.filter((each, i) => i === 0 || i === splitFullname.length - 1);
    }else{
      return null
    }
  };
  // Render
  return(
    <div className="dashboard-appbar-container">
      <div className="user-loggedin" tabIndex="-1">
        <div className="selector-container">
          <div className="user-logo-text">
            <p>{getSimpleName()}</p>
          </div>
          <div className={isSuperadmin ? "user-identity superadmin-role" : "user-identity"}>
            <p>{user.fullname}</p>
            {isSuperadmin ? <p>Superadmin</p> : null}
          </div>
          <button>
            <i className="fas fa-angle-down"/>
          </button>
        </div>
        <div className="user-loggedin-dialog">
          <Link to={`${rootRoute}/settings`}><Translator id="commonGroup.settings"/></Link>
          <p onClick={logoutMethod}><Translator id="commonGroup.logout"/></p>
        </div>
      </div>
    </div>
  )
};

export default DashboardAppbar