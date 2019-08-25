import React from "react";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";

const Department = () => {
  return(
    <PageRouteHeader>
      <Translator id="departmentGroup.department"/>
    </PageRouteHeader>
  )
};

export const CreateDepartmentModal = () => {
  return "This is department modal"
};

export default Department