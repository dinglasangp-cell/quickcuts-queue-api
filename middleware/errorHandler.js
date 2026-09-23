// Task 8: one centralized error handler. Every route calls next(err)
// on failure instead of throwing, so everything funnels here and the
// server never crashes or leaks a raw stack trace to the client.
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong on the server'
  });
}

module.exports = errorHandler;
