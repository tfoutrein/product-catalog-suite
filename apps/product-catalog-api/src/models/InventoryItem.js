const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  min_threshold: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 0
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_restock_date: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'inventory_items',
  timestamps: true
});

InventoryItem.belongsTo(Product, { 
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

Product.hasOne(InventoryItem, { 
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

module.exports = InventoryItem; 