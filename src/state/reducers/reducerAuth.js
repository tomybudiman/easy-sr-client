const initialState = {
  authToken: null,
  tokenVerified: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_AUTH_TOKEN":
      return {...state, authToken: payload};
    case "SET_TOKEN_VERIFIED":
      return {...state, tokenVerified: payload};
    default:
      return state
  }
}