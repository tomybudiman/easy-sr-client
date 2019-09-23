const initialState = {
  authToken: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_AUTH_TOKEN":
      return {...state, authToken: payload};
    default:
      return state
  }
}