const initialState = {
  selectedIndustryEdit: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_SELECTED_INDUSTRY_EDIT":
      return {...state, selectedIndustryEdit: payload};
    default:
      return state
  }
}