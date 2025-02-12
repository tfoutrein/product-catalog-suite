const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Récupère tous les produits
 *     tags: [Produits]
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Recherche des produits avec filtres
 *     tags: [Produits]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Terme de recherche
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la catégorie
 *       - in: query
 *         name: subcategory
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la sous-catégorie
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Prix minimum
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Prix maximum
 *     responses:
 *       200:
 *         description: Résultats de la recherche
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Erreur serveur
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupère un produit par son ID
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Détails du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crée un nouveau produit
 *     tags: [Produits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sub_category_id
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 200
 *               sub_category_id:
 *                 type: string
 *                 format: uuid
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               brand:
 *                 type: string
 *                 maxLength: 100
 *               image_url:
 *                 type: string
 *                 format: uri
 *               weight_volume:
 *                 type: string
 *                 maxLength: 50
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
const validateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 200 })
    .withMessage('Le nom ne doit pas dépasser 200 caractères'),
  body('sub_category_id')
    .notEmpty()
    .withMessage('L\'ID de la sous-catégorie est requis')
    .isUUID()
    .withMessage('L\'ID de la sous-catégorie doit être un UUID valide'),
  body('price')
    .notEmpty()
    .withMessage('Le prix est requis')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('brand')
    .optional()
    .isLength({ max: 100 })
    .withMessage('La marque ne doit pas dépasser 100 caractères'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('L\'URL de l\'image doit être valide'),
  body('attributes')
    .optional()
    .isArray()
    .withMessage('Les attributs doivent être un tableau'),
  body('attributes.*.name')
    .optional()
    .isString()
    .withMessage('Le nom de l\'attribut doit être une chaîne de caractères'),
  body('attributes.*.value')
    .optional()
    .isString()
    .withMessage('La valeur de l\'attribut doit être une chaîne de caractères')
];

router.post('/', validateProduct, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     tags: [Produits]
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
 *                 maxLength: 200
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 minimum: 0
 *               brand:
 *                 type: string
 *                 maxLength: 100
 *               image_url:
 *                 type: string
 *                 format: uri
 *               weight_volume:
 *                 type: string
 *                 maxLength: 50
 *               attributes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     value:
 *                       type: string
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       404:
 *         description: Produit non trouvé
 *       400:
 *         description: Données invalides
 */
router.put('/:id', validateProduct, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Supprime un produit
 *     tags: [Produits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Produit supprimé
 *       404:
 *         description: Produit non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', productController.deleteProduct);

module.exports = router; 