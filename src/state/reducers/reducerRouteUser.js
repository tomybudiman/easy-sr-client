const initialState = {
  selectedUserEdit: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_SELECTED_USER_EDIT":
      return {...state, selectedUserEdit: payload};
    default:
      return state
  }
}