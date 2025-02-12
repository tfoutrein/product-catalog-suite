const { 
  Category, 
  SubCategory, 
  Product, 
  ProductAttribute, 
  Inventory, 
  InventoryItem 
} = require('../models');

const wipeDatabase = async () => {
  try {
    console.log('Début du nettoyage de la base de données...');

    // Suppression dans l'ordre inverse des dépendances
    console.log('Suppression des items d\'inventaire...');
    await InventoryItem.destroy({ where: {}, force: true });

    console.log('Suppression des attributs de produits...');
    await ProductAttribute.destroy({ where: {}, force: true });

    console.log('Suppression des produits...');
    await Product.destroy({ where: {}, force: true });

    console.log('Suppression des sous-catégories...');
    await SubCategory.destroy({ where: {}, force: true });

    console.log('Suppression des catégories...');
    await Category.destroy({ where: {}, force: true });

    console.log('Suppression des inventaires...');
    await Inventory.destroy({ where: {}, force: true });

    console.log('Base de données nettoyée avec succès !');
  } catch (error) {
    console.error('Erreur lors du nettoyage de la base de données:', error);
    process.exit(1);
  }
};

// Exécution du script si appelé directement
if (require.main === module) {
  wipeDatabase();
}

module.exports = wipeDatabase; 