const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     tags:
 *       - Authentification
 *     summary: Authentification avec Google
 *     description: Authentifie un utilisateur avec Google OAuth et retourne un JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - credential
 *             properties:
 *               credential:
 *                 type: string
 *                 description: Le token d'identification Google
 *     responses:
 *       200:
 *         description: Authentification réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT pour les requêtes authentifiées
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Échec de l'authentification
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/google', authController.authenticateWithGoogle);

module.exports = router; 