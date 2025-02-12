const express = require('express');
const router = express.Router();
const descriptionController = require('../controllers/DescriptionController');

/**
 * @swagger
 * /api/descriptions/generate:
 *   post:
 *     summary: Génère une description pour un produit
 *     tags: [Descriptions]
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
 *                 description: Nom du produit
 *               brand:
 *                 type: string
 *                 description: Marque du produit (optionnel)
 *     responses:
 *       200:
 *         description: Description générée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/generate', descriptionController.generateDescription);

module.exports = router; 