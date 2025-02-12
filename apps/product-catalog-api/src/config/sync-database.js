const sequelize = require('./database');
const seedDatabase = require('../seeders/seed');

const syncDatabase = async () => {
  try {
    console.log('Synchronisation de la base de données...');
    await sequelize.sync({ force: true });
    console.log('Base de données synchronisée avec succès !');

    console.log('Démarrage du peuplement de la base de données...');
    await seedDatabase();
    console.log('Opération terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de la synchronisation/peuplement de la base de données:', error);
    process.exit(1);
  }
};

// Exécution du script si appelé directement
if (require.main === module) {
  syncDatabase();
}

module.exports = syncDatabase; 