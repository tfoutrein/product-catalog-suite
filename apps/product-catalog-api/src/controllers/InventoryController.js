const { Inventory, InventoryItem, Product } = require('../models');
const { Op, literal } = require('sequelize');
const sequelize = require('../config/database');

class InventoryController {
  async getAllInventories(req, res) {
    try {
      const inventories = await Inventory.findAll({
        include: [{
          model: InventoryItem,
          include: [Product]
        }]
      });
      res.json(inventories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getInventoryById(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id, {
        include: [{
          model: InventoryItem,
          include: [Product]
        }]
      });
      if (!inventory) {
        return res.status(404).json({ message: 'Inventaire non trouvé' });
      }
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createInventory(req, res) {
    try {
      const inventory = await Inventory.create(req.body);
      res.status(201).json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateInventory(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (!inventory) {
        return res.status(404).json({ message: 'Inventaire non trouvé' });
      }
      await inventory.update(req.body);
      res.json(inventory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteInventory(req, res) {
    try {
      const inventory = await Inventory.findByPk(req.params.id);
      if (!inventory) {
        return res.status(404).json({ message: 'Inventaire non trouvé' });
      }
      await inventory.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { product_id, quantity, min_threshold } = req.body;
      
      let inventoryItem = await InventoryItem.findOne({
        where: { product_id }
      });

      if (inventoryItem) {
        await inventoryItem.update({
          quantity,
          min_threshold,
          last_restock_date: new Date()
        });
      } else {
        inventoryItem = await InventoryItem.create({
          product_id,
          quantity,
          min_threshold,
          last_restock_date: new Date()
        });
      }

      const updatedItem = await InventoryItem.findByPk(inventoryItem.id, {
        include: [Product]
      });

      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllInventory(req, res) {
    try {
      const inventory = await InventoryItem.findAll({
        include: [{
          model: Product,
          attributes: ['id', 'name', 'brand']
        }]
      });
      res.json(inventory);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'inventaire:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getInventoryItemById(req, res) {
    try {
      const item = await InventoryItem.findByPk(req.params.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'brand']
        }]
      });
      if (!item) {
        return res.status(404).json({ message: 'Article d\'inventaire non trouvé' });
      }
      res.json(item);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'article:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async updateInventoryItem(req, res) {
    try {
      const { quantity, location } = req.body;
      const item = await InventoryItem.findByPk(req.params.id);

      if (!item) {
        return res.status(404).json({ message: 'Article d\'inventaire non trouvé' });
      }

      if (quantity < 0) {
        return res.status(400).json({ message: 'La quantité ne peut pas être négative' });
      }

      await item.update({
        quantity,
        location: location || item.location,
        last_restock_date: new Date()
      });

      const updatedItem = await InventoryItem.findByPk(item.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'brand']
        }]
      });

      res.json(updatedItem);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'article:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async createInventoryItem(req, res) {
    try {
      const { product_id, quantity, location } = req.body;

      // Vérifier si un article d'inventaire existe déjà pour ce produit
      let item = await InventoryItem.findOne({
        where: { product_id }
      });

      if (item) {
        return res.status(400).json({ message: 'Un article d\'inventaire existe déjà pour ce produit' });
      }

      if (quantity < 0) {
        return res.status(400).json({ message: 'La quantité ne peut pas être négative' });
      }

      item = await InventoryItem.create({
        product_id,
        quantity,
        location,
        last_restock_date: new Date()
      });

      const createdItem = await InventoryItem.findByPk(item.id, {
        include: [{
          model: Product,
          attributes: ['id', 'name', 'brand']
        }]
      });

      res.status(201).json(createdItem);
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async getLowStockItems(req, res) {
    try {
      const lowStockItems = await InventoryItem.findAll({
        where: {
          quantity: {
            [Op.lte]: sequelize.col('min_threshold')
          }
        },
        include: [{
          model: Product,
          attributes: ['id', 'name', 'brand']
        }]
      });

      res.json(lowStockItems);
    } catch (error) {
      console.error('Erreur lors de la récupération des articles en stock bas:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new InventoryController(); 