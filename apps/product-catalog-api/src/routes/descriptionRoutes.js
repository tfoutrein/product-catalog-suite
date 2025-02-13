const express = require('express');
const router = express.Router();
const descriptionController = require('../controllers/DescriptionController');

/**
 * @swagger
 * /api/descriptions/generate:
 *   post:
 *     tags:
 *       - Descriptions
 *     summary: Génère une description pour un produit
 *     description: Utilise Google Search et Hugging Face pour générer une description pertinente
 *     security:
 *       - BearerAuth: []
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
 *                   description: Description générée
 *                 imageUrl:
 *                   type: string
 *                   description: URL de l'image trouvée (optionnel)
 *       400:
 *         description: Paramètres invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/generate', descriptionController.generateDescription);

module.exports = router; 