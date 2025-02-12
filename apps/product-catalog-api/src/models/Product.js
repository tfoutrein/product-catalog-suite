const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SubCategory = require('./SubCategory');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  sub_category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: SubCategory,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  weight_volume: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'products',
  timestamps: false
});

Product.belongsTo(SubCategory, { foreignKey: 'sub_category_id' });
SubCategory.hasMany(Product, { foreignKey: 'sub_category_id' });

module.exports = Product; 