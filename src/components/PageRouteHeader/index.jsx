import React from "react";
import {Link} from "react-router-dom";

import "./index.scss";
import history from "../../utils/history";

const PageRouteHeader = ({children}) => {
  const pageRoute = history.location.pathname.slice(1).split("/").map((each, i) => {
    return {
      url: i === 0 ? "/dashboard" : null,
      label: each.replace(/[-_]/g, " ").replace(/(^|\s)[a-z]/g, str => str.toUpperCase())
    }
  });
  return(
    <div className="page-route-header">
      <div className="page-title">{children}</div>
      <div className="page-route">
        {pageRoute.map((each, i) => {
          if(i === pageRoute.length - 1){
            return each.url ? <Link to={each.url}>{each.label}</Link> : <p key={i}>{each.label}</p>
          }else{
            return(
              <React.Fragment key={i}>
                {each.url ? <Link to={each.url}>{each.label}</Link> : <p key={i}>{each.label}</p>}
                <span>/</span>
              </React.Fragment>
            )
          }
        })}
      </div>
    </div>
  )
};

export default PageRouteHeader