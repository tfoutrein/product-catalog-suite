const { Product, SubCategory, ProductAttribute, InventoryItem } = require('../models');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.findAll({
        include: [
          { model: SubCategory },
          { model: ProductAttribute },
          { model: InventoryItem }
        ]
      });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [
          { model: SubCategory },
          { model: ProductAttribute },
          { model: InventoryItem }
        ]
      });
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const { attributes, ...productData } = req.body;
      const product = await Product.create(productData);

      if (attributes && attributes.length > 0) {
        await Promise.all(
          attributes.map(attr => 
            ProductAttribute.create({
              ...attr,
              product_id: product.id
            })
          )
        );
      }

      const createdProduct = await Product.findByPk(product.id, {
        include: [
          { model: SubCategory },
          { model: ProductAttribute }
        ]
      });

      res.status(201).json(createdProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const { attributes, ...productData } = req.body;
      const product = await Product.findByPk(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      await product.update(productData);

      if (attributes) {
        await ProductAttribute.destroy({
          where: { product_id: product.id }
        });

        if (attributes.length > 0) {
          await Promise.all(
            attributes.map(attr =>
              ProductAttribute.create({
                ...attr,
                product_id: product.id
              })
            )
          );
        }
      }

      const updatedProduct = await Product.findByPk(product.id, {
        include: [
          { model: SubCategory },
          { model: ProductAttribute }
        ]
      });

      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Supprimer d'abord les attributs du produit
      await ProductAttribute.destroy({
        where: { product_id: product.id }
      });

      // Supprimer les éléments d'inventaire associés
      await InventoryItem.destroy({
        where: { product_id: product.id }
      });

      // Enfin, supprimer le produit
      await product.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async searchProducts(req, res) {
    try {
      const { query, category, subcategory, minPrice, maxPrice } = req.query;
      const whereClause = {};
      const includeClause = [
        { model: SubCategory },
        { model: ProductAttribute },
        { model: InventoryItem }
      ];

      if (query) {
        whereClause.name = { [Op.iLike]: `%${query}%` };
      }

      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = minPrice;
        if (maxPrice) whereClause.price[Op.lte] = maxPrice;
      }

      if (subcategory) {
        whereClause.sub_category_id = subcategory;
      } else if (category) {
        includeClause[0] = {
          model: SubCategory,
          where: { category_id: category }
        };
      }

      const products = await Product.findAll({
        where: whereClause,
        include: includeClause
      });

      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductController(); 