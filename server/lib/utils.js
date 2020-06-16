const arrayEqual = function arrayEqual(array1, array2) {
  // checks two arrays for deep quality and returns true or false
  // depending on whether there are differing elements (works 
  // recursively to check those nested RGB values in a 2d frame array)
  if (array1.length !== array2.length) return false;

  for (let i = 0; i < array1.length; i += 1) {
    // check for element type array and call self to deep check
    if (Array.isArray(array1[i]) && Array.isArray(array2[i])) {
      if (!arrayEqual(array1[i], array2[i])) return false;
    } else {
      if (array1[i] !== array2[i]) return false;
    }
  }
  return true;
}

const objectsEqual = function objectsEqual(obj1, obj2) {
  // shallow checks two objects for equality
  const keyLengthEqual = Object.keys(obj1).length === Object.keys(obj2).length;
  const valuesEqual = Object.keys(obj1).every(key => obj1[key] === obj2[key]);
  return keyLengthEqual && valuesEqual;
}

module.exports = {
  arrayEqual,
  objectsEqual,
};
