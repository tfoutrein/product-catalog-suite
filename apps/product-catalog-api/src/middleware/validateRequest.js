const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: errors.array().map(err => ({
        message: err.msg,
        field: err.param
      }))
    });
  }
  next();
};

module.exports = validateRequest; 