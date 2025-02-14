const express = require('express');
const router = express.Router();
const brandController = require('../controllers/BrandController');

/**
 * @swagger
 * /api/brands/detect:
 *   post:
 *     tags:
 *       - Marques
 *     summary: Détecte la marque d'un produit
 *     description: Analyse le nom du produit pour détecter automatiquement la marque
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
 *                 description: Nom du produit à analyser
 *     responses:
 *       200:
 *         description: Marque détectée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 brand:
 *                   type: string
 *                   description: Nom de la marque détectée (null si aucune marque n'est détectée)
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
router.post('/detect', brandController.detectBrand);

module.exports = router; 