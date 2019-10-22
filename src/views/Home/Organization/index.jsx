import React from "react";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

const Organization = () => {
  return(
    <React.Fragment>
      <PageRouteHeader>
        <Translator id="organizationGroup.organization"/>
      </PageRouteHeader>
    </React.Fragment>
  )
};

export default Organization