export const reverseObject = object => {
  var newObject = {};
  var keys = [];
  if (!object) return keys;

  for (var key in object) {
    keys.push(key);
  }

  for (var i = keys.length - 1; i >= 0; i--) {
    var value = object[keys[i]];
    newObject[keys[i]] = value;
  }

  return newObject;
};
