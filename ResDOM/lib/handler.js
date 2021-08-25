function getElm(str) {
  const str2 = str.replace('_', '-');
  var e = document.getElementById(str);
  if (!e) e = document.getElementById(str2);
  return e;
}

export const viewID = {
  get: (o, key) => {
    if (!(key in o)) {
      o[key] = () => getElm(key);
    }
    return o[key]
  }
}