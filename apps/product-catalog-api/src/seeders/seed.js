const { 
  Category, 
  SubCategory, 
  Product, 
  ProductAttribute, 
  InventoryItem 
} = require('../models');

const seedDatabase = async () => {
  try {
    console.log('Début du nettoyage de la base de données...');
    
    // Nettoyage de la base de données dans l'ordre inverse des dépendances
    console.log('Suppression des items d\'inventaire...');
    await InventoryItem.destroy({ where: {} });
    
    console.log('Suppression des attributs de produits...');
    await ProductAttribute.destroy({ where: {} });
    
    console.log('Suppression des produits...');
    await Product.destroy({ where: {} });
    
    console.log('Suppression des sous-catégories...');
    await SubCategory.destroy({ where: {} });
    
    console.log('Suppression des catégories...');
    await Category.destroy({ where: {} });
    
    console.log('Base de données nettoyée avec succès !');

    // Création des catégories
    const categories = await Category.bulkCreate([
      {
        name: 'Électronique',
        description: 'Produits électroniques et accessoires'
      },
      {
        name: 'Vêtements',
        description: 'Vêtements et accessoires de mode'
      },
      {
        name: 'Maison',
        description: 'Articles pour la maison et le jardin'
      }
    ]);

    // Création des sous-catégories
    const subCategories = await SubCategory.bulkCreate([
      {
        name: 'Smartphones',
        description: 'Téléphones mobiles et accessoires',
        category_id: categories[0].id
      },
      {
        name: 'Ordinateurs',
        description: 'Ordinateurs portables et de bureau',
        category_id: categories[0].id
      },
      {
        name: 'Hommes',
        description: 'Vêtements pour hommes',
        category_id: categories[1].id
      },
      {
        name: 'Femmes',
        description: 'Vêtements pour femmes',
        category_id: categories[1].id
      },
      {
        name: 'Cuisine',
        description: 'Articles de cuisine',
        category_id: categories[2].id
      }
    ]);

    // Création des produits
    const products = await Product.bulkCreate([
      {
        name: 'iPhone 13',
        description: 'Smartphone Apple dernière génération',
        price: 999.99,
        brand: 'Apple',
        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-finish-select-202207-6-1inch-blue?wid=2560&hei=1440&fmt=jpeg&qlt=95&.v=1656712888128',
        weight_volume: '174g',
        sub_category_id: subCategories[0].id
      },
      {
        name: 'MacBook Pro',
        description: 'Ordinateur portable professionnel',
        price: 1299.99,
        brand: 'Apple',
        image_url: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp-spacegray-select-202206?wid=904&hei=840&fmt=jpeg&qlt=95&.v=1664497359481',
        weight_volume: '1.4kg',
        sub_category_id: subCategories[1].id
      },
      {
        name: 'Jean Slim',
        description: 'Jean coupe slim en denim',
        price: 59.99,
        brand: 'Levi\'s',
        image_url: 'https://lsco.scene7.com/is/image/lsco/A46250000-dynamic1-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=1.25,0.6,8&wid=2000&hei=1800',
        weight_volume: '500g',
        sub_category_id: subCategories[2].id
      },
      {
        name: 'Robe d\'été',
        description: 'Robe légère pour l\'été',
        price: 45.99,
        brand: 'Zara',
        image_url: 'https://static.zara.net/photos///2024/V/0/1/p/2731/026/712/2/w/563/2731026712_2_1_1.jpg?ts=1708506545646',
        weight_volume: '200g',
        sub_category_id: subCategories[3].id
      },
      {
        name: 'Robot Cuisine KitchenAid Artisan',
        description: 'Robot multifonction pour la cuisine',
        price: 299.99,
        brand: 'KitchenAid',
        image_url: 'https://kitchenaid-h.assetsadobe.com/is/image/content/dam/business-unit/whirlpool/en-us/marketing-content/site-assets/product-images/cooking/major-appliances/ranges/hero-image-ranges.png',
        weight_volume: '5kg',
        sub_category_id: subCategories[4].id
      }
    ]);

    // Création des attributs de produits
    await ProductAttribute.bulkCreate([
      {
        product_id: products[0].id,
        name: 'Couleur',
        value: 'Bleu'
      },
      {
        product_id: products[0].id,
        name: 'Stockage',
        value: '128 Go'
      },
      {
        product_id: products[1].id,
        name: 'RAM',
        value: '16 Go'
      },
      {
        product_id: products[2].id,
        name: 'Taille',
        value: '32'
      },
      {
        product_id: products[3].id,
        name: 'Taille',
        value: 'M'
      }
    ]);

    // Création des items d'inventaire
    await InventoryItem.bulkCreate([
      {
        product_id: products[0].id,
        quantity: 100,
        min_threshold: 20,
        location: 'Entrepôt Paris'
      },
      {
        product_id: products[1].id,
        quantity: 50,
        min_threshold: 10,
        location: 'Entrepôt Paris'
      },
      {
        product_id: products[2].id,
        quantity: 200,
        min_threshold: 30,
        location: 'Entrepôt Lyon'
      },
      {
        product_id: products[3].id,
        quantity: 150,
        min_threshold: 25,
        location: 'Entrepôt Lyon'
      }
    ]);

    console.log('Base de données peuplée avec succès !');
  } catch (error) {
    console.error('Erreur lors du peuplement de la base de données:', error);
  }
};

// Exécution du script si appelé directement
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 