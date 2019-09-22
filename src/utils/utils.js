export const readUrlQueryValue = name => {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const result = regex.exec(url);
  if(!result){
    return null
  }
  if(!result[2]){
    return ''
  }
  return decodeURIComponent(result[2].replace(/\+/g, ' '));
};