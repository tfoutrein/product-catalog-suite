const { Category, SubCategory, Product } = require('../models');
const { Op } = require('sequelize');

class CategoryController {
  async getAllCategories(req, res) {
    try {
      const includeProducts = req.query.include === 'products';
      const include = [
        {
          model: SubCategory,
          include: includeProducts ? [{ model: Product }] : []
        }
      ];

      const categories = await Category.findAll({ include });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [{ model: SubCategory }]
      });
      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const { name, description, SubCategories } = req.body;
      
      const category = await Category.create({
        name,
        description
      });

      if (SubCategories && Array.isArray(SubCategories)) {
        await Promise.all(
          SubCategories.map(subCategory =>
            SubCategory.create({
              ...subCategory,
              category_id: category.id
            })
          )
        );
      }

      const createdCategory = await Category.findByPk(category.id, {
        include: [{ model: SubCategory }]
      });

      res.status(201).json(createdCategory);
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const { name, description, SubCategories } = req.body;
      const category = await Category.findByPk(req.params.id);

      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }

      await category.update({
        name,
        description
      });

      if (SubCategories && Array.isArray(SubCategories)) {
        // Récupérer les sous-catégories existantes
        const existingSubCategories = await SubCategory.findAll({
          where: { category_id: category.id },
          include: [{
            model: Product,
            attributes: ['id']
          }]
        });

        // Mettre à jour les sous-catégories existantes
        for (const existingSub of existingSubCategories) {
          const updatedSub = SubCategories.find(sub => sub.id === existingSub.id);
          if (updatedSub) {
            await existingSub.update({
              name: updatedSub.name,
              description: updatedSub.description
            });
          }
        }

        // Ajouter les nouvelles sous-catégories
        const newSubCategories = SubCategories.filter(sub => !sub.id);
        if (newSubCategories.length > 0) {
          await Promise.all(
            newSubCategories.map(subCategory =>
              SubCategory.create({
                ...subCategory,
                category_id: category.id
              })
            )
          );
        }

        // Supprimer les sous-catégories qui ne sont plus présentes et qui n'ont pas de produits associés
        const subCategoryIds = SubCategories.map(sub => sub.id).filter(id => id);
        const subCategoriesToDelete = existingSubCategories.filter(sub => 
          !subCategoryIds.includes(sub.id) && (!sub.Products || sub.Products.length === 0)
        );

        if (subCategoriesToDelete.length > 0) {
          await SubCategory.destroy({
            where: {
              id: subCategoriesToDelete.map(sub => sub.id)
            }
          });
        }
      }

      const updatedCategory = await Category.findByPk(category.id, {
        include: [{ model: SubCategory }]
      });

      res.json(updatedCategory);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const category = await Category.findByPk(req.params.id, {
        include: [{
          model: SubCategory,
          include: [{
            model: Product
          }]
        }]
      });

      if (!category) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }

      // Compter le nombre total de produits dans toutes les sous-catégories
      const totalProducts = category.SubCategories?.reduce((sum, sub) => sum + (sub.Products?.length || 0), 0) || 0;

      // Vérifier si des sous-catégories ont des produits
      if (totalProducts > 0) {
        return res.status(400).json({
          message: `Impossible de supprimer la catégorie car ${totalProducts} produit${totalProducts > 1 ? 's' : ''} lui ${totalProducts > 1 ? 'sont associés' : 'est associé'}`
        });
      }

      // Supprimer d'abord les sous-catégories
      await SubCategory.destroy({
        where: { category_id: category.id }
      });

      // Puis supprimer la catégorie
      await category.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CategoryController(); 