const initialState = {
  locale: "en"
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "CHANGE_ACTIVE_LOCALE":
      return {...state, locale: payload};
    default:
      return state
  }
}