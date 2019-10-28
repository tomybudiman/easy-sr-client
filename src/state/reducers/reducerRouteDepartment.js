const initialState = {
  selectedDepartmentEdit: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_SELECTED_DEPARTMENT_EDIT":
      return {...state, selectedDepartmentEdit: payload};
    default:
      return state
  }
}