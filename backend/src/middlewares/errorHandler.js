const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
  
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = err.errors || [];
  
    // PostgreSQL unique violation
    if (err.code === '23505') {
      statusCode = 409;
      message = 'Duplicate entry';
      errors = [{ field: 'unknown', message: 'This value already exists' }];
    }
  
    // PostgreSQL foreign key violation
    if (err.code === '23503') {
      statusCode = 409;
      message = 'Cannot delete - record is being used';
    }
  
    // PostgreSQL not null violation
    if (err.code === '23502') {
      statusCode = 400;
      message = 'Required field missing';
    }
  
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  };
  
  module.exports = errorHandler;