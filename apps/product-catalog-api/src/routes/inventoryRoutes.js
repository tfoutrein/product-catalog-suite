const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/InventoryController');
const { body } = require('express-validator');

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Récupère tous les inventaires
 *     tags: [Inventaire]
 *     responses:
 *       200:
 *         description: Liste des inventaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', inventoryController.getAllInventory);

/**
 * @swagger
 * /api/inventory/low-stock:
 *   get:
 *     summary: Liste les articles en stock bas
 *     tags: [Inventaire]
 *     responses:
 *       200:
 *         description: Liste des articles en stock bas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   quantity:
 *                     type: integer
 *                   min_threshold:
 *                     type: integer
 *                   product:
 *                     $ref: '#/components/schemas/Product'
 *                   inventory:
 *                     $ref: '#/components/schemas/Inventory'
 *       500:
 *         description: Erreur serveur
 */
router.get('/low-stock', inventoryController.getLowStockItems);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Récupère un inventaire par son ID
 *     tags: [Inventaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de l'inventaire
 *     responses:
 *       200:
 *         description: Détails de l'inventaire
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Inventory'
 *       404:
 *         description: Inventaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', inventoryController.getInventoryItemById);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Crée un nouvel inventaire
 *     tags: [Inventaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 100
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inventaire créé
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
const validateInventoryItem = [
  body('product_id')
    .notEmpty()
    .withMessage('L\'ID du produit est requis')
    .isUUID()
    .withMessage('L\'ID du produit doit être un UUID valide'),
  body('quantity')
    .notEmpty()
    .withMessage('La quantité est requise')
    .isInt({ min: 0 })
    .withMessage('La quantité doit être un nombre entier positif'),
  body('location')
    .optional()
    .isString()
    .withMessage('L\'emplacement doit être une chaîne de caractères')
];

router.post('/', validateInventoryItem, inventoryController.createInventoryItem);

/**
 * @swagger
 * /api/inventory/stock:
 *   post:
 *     summary: Met à jour le stock d'un produit
 *     tags: [Inventaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inventory_id
 *               - product_id
 *               - quantity
 *               - min_threshold
 *             properties:
 *               inventory_id:
 *                 type: string
 *                 format: uuid
 *               product_id:
 *                 type: string
 *                 format: uuid
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *               min_threshold:
 *                 type: integer
 *                 minimum: 0
 *     responses:
 *       200:
 *         description: Stock mis à jour
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
const validateStockUpdate = [
  body('inventory_id')
    .notEmpty()
    .withMessage('L\'ID de l\'inventaire est requis')
    .isUUID()
    .withMessage('L\'ID de l\'inventaire doit être un UUID valide'),
  body('product_id')
    .notEmpty()
    .withMessage('L\'ID du produit est requis')
    .isUUID()
    .withMessage('L\'ID du produit doit être un UUID valide'),
  body('quantity')
    .notEmpty()
    .withMessage('La quantité est requise')
    .isInt({ min: 0 })
    .withMessage('La quantité doit être un nombre entier positif'),
  body('min_threshold')
    .notEmpty()
    .withMessage('Le seuil minimal est requis')
    .isInt({ min: 0 })
    .withMessage('Le seuil minimal doit être un nombre entier positif')
];

router.post('/stock', validateStockUpdate, inventoryController.updateStock);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Met à jour un inventaire
 *     tags: [Inventaire]
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
 *               address:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventaire mis à jour
 *       404:
 *         description: Inventaire non trouvé
 *       400:
 *         description: Données invalides
 */
router.put('/:id', validateInventoryItem, inventoryController.updateInventoryItem);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Supprime un inventaire
 *     tags: [Inventaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Inventaire supprimé
 *       404:
 *         description: Inventaire non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', inventoryController.deleteInventory);

module.exports = router; 