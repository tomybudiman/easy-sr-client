import React from "react";

import "./index.scss";
import history from "../../utils/history";

const PageRouteHeader = ({children}) => {
  const pageRoute = history.location.pathname.slice(1).split("/").map(each => {
    return each.replace(/[-_]/g, " ").replace(/(^|\s)[a-z]/g, str => str.toUpperCase());
  });
  return(
    <div className="page-route-header">
      <div className="page-title">{children}</div>
      <div className="page-route">
        {pageRoute.map((each, i) => {
          if(i === pageRoute.length - 1){
            return <p key={i}>{each}</p>
          }else{
            return(
              <React.Fragment key={i}>
                <p>{each}</p>
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