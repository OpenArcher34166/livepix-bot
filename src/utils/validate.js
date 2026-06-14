function isValidId(id) {
  return typeof id === "string" && id.length >= 3;
}

function isValidNumber(value) {
  return !isNaN(value) && Number(value) > 0;
}

function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 2;
}

module.exports = {
  isValidId,
  isValidNumber,
  isValidName
};