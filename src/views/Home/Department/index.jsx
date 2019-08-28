import React from "react";
import MaterialTable, {MTableToolbar} from "material-table";

import Translator from "../../../components/Translator";
import PageRouteHeader from "../../../components/PageRouteHeader";
import Button from "@material-ui/core/Button";

const Department = ({onClickEvent}) => {
  const tableStyle = {
    marginTop: "16px",
    boxShadow: "3px 0 30px rgba(17, 31, 93, 0.08), 2px 0 5px rgba(27, 27, 43, 0.09)"
  };
  const tableOptions = {
    showTitle: false
  };
  const tableColumns = [
    {title: "Name", field: "name"},
    {title: "ID", field: "id"}
  ];
  const tableComponents = {
    Toolbar: props => (
      <React.Fragment>
        <MTableToolbar {...props}/>
        <div className="department-datatable-toolbar">
          <Button size="small" onClick={e => onClickEvent({e, data: {id: "createDepartment"}})}>
            <Translator id="departmentGroup.createNewDepartment"/>
          </Button>
        </div>
      </React.Fragment>
    )
  };
  return(
    <React.Fragment>
      <PageRouteHeader>
        <Translator id="departmentGroup.department"/>
      </PageRouteHeader>
      <MaterialTable
        style={tableStyle}
        options={tableOptions}
        columns={tableColumns}
        components={tableComponents}/>
    </React.Fragment>
  )
};

export const CreateDepartmentModal = () => {
  return "This is department modal"
};

export default Department