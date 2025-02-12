const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Category,
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'sub_categories',
  timestamps: false
});

SubCategory.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(SubCategory, { foreignKey: 'category_id' });

module.exports = SubCategory; 