const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/', async (req, res) => {
  try {
    const { text, maxLength = 150, language = 'fr' } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Le texte à résumer est requis' });
    }

    // Utilisation de l'API de Claude.ai pour le résumé
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-haiku-20240307',
      max_tokens: maxLength,
      messages: [{
        role: 'user',
        content: `Résume ce texte en français en ${maxLength} caractères maximum, en gardant les informations essentielles et en utilisant un ton professionnel et marketing : ${text}`
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      }
    });

    if (response.data && response.data.content) {
      res.json({ summary: response.data.content[0].text });
    } else {
      throw new Error('Réponse invalide de l\'API');
    }
  } catch (error) {
    console.error('Erreur lors du résumé:', error);
    res.status(500).json({ message: 'Erreur lors de la génération du résumé' });
  }
});

module.exports = router; 