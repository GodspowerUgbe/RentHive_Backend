

const handleError = (err, req, res, next) => {
  const { message, statusCode } = err;
  console.error(err);
  res.status(statusCode || 500).json({
    success: false,
    message: statusCode ? (message || 'Internal Server Error') : 'Internal Server Error'
  });
};  

module.exports = handleError;
