const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      details: err.errors.map(e => ({
        message: e.message,
        field: e.path
      }))
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Erreur de contrainte de clé étrangère',
      message: 'La référence spécifiée n\'existe pas'
    });
  }

  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
};

module.exports = errorHandler; 