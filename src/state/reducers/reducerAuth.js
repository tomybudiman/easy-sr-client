const initialState = {
  authToken: null,
  tokenVerified: null,
  userTokenData: null
};

export default (state = initialState, {type, payload}) => {
  switch(type){
    case "SET_AUTH_TOKEN":
      return {...state, authToken: payload};
    case "SET_TOKEN_VERIFIED":
      return {...state, tokenVerified: payload};
    case "SET_USER_TOKEN_DATA":
      return {...state, userTokenData: payload};
    default:
      return state
  }
}