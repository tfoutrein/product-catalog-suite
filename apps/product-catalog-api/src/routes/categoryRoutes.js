const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/CategoryController');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupère toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', categoryController.getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupère une catégorie par son ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie
 *     responses:
 *       200:
 *         description: Détails de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crée une nouvelle catégorie
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Catégorie créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
const validateCategory = [
  body('name')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 100 })
    .withMessage('Le nom ne doit pas dépasser 100 caractères'),
  body('description')
    .optional()
    .isString()
    .withMessage('La description doit être une chaîne de caractères')
];

router.post('/', validateCategory, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Met à jour une catégorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Catégorie mise à jour
 *       404:
 *         description: Catégorie non trouvée
 *       400:
 *         description: Données invalides
 */
router.put('/:id', validateCategory, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Supprime une catégorie
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Catégorie supprimée
 *       404:
 *         description: Catégorie non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; 