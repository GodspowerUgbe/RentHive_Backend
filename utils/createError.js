const createError = (message, statusCode) => {
  console.log('createrror',statusCode)
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = createError;
