const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');

const ProductAttribute = sequelize.define('ProductAttribute', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'product_attributes',
  timestamps: false
});

ProductAttribute.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductAttribute, { foreignKey: 'product_id' });

module.exports = ProductAttribute; 