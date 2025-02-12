const axios = require('axios');

class DescriptionController {
  constructor() {
    // Bind des méthodes pour préserver le contexte
    this.generateDescription = this.generateDescription.bind(this);
    this.searchProductInfo = this.searchProductInfo.bind(this);
    this.generateSummary = this.generateSummary.bind(this);
    this.generateFromTemplate = this.generateFromTemplate.bind(this);
  }

  async generateDescription(req, res) {
    try {
      const { name, brand } = req.body;
      const isDebugMode = process.env.DEBUG_ENV === 'true';
      console.log(`🔍 Recherche de description pour : ${name} ${brand ? `(${brand})` : ''}`);

      if (!name) {
        console.log('❌ Erreur : Le nom du produit est requis');
        return res.status(400).json({ message: 'Le nom du produit est requis' });
      }

      // Lancer la recherche d'informations immédiatement
      const searchResult = await this.searchProductInfo(name, brand, isDebugMode);
      let rawDescription = searchResult?.description;
      let imageUrl = searchResult?.imageUrl;

      if (!rawDescription) {
        console.log('⚠️ Aucune information trouvée via Google Search, utilisation des templates');
        return this.generateFromTemplate(name, brand, res, imageUrl);
      }

      // Génération du résumé via Hugging Face
      try {
        const summary = await this.generateSummary(rawDescription, isDebugMode);
        if (summary) {
          console.log('✅ Résumé généré via IA :', summary);
          return res.json({ 
            description: summary,
            imageUrl: imageUrl || null
          });
        }
      } catch (error) {
        console.error('❌ Erreur lors de la génération du résumé:', error);
        if (isDebugMode) {
          console.error('🔧 Mode Debug - Détails de l\'erreur:', error.response?.data || error.message);
        }
      }

      // Si le résumé échoue, utiliser la description brute
      return res.json({ 
        description: rawDescription,
        imageUrl: imageUrl || null
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération de la description:', error);
      return this.generateFromTemplate(name, brand, res);
    }
  }

  async searchProductInfo(name, brand, isDebugMode) {
    try {
      if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CSE_ID) {
        console.log('❌ Erreur : Configuration Google Search manquante');
        return null;
      }

      console.log('📡 Appel API Google Search...');
      
      // Premier appel pour la description
      if (isDebugMode) {
        console.log('🔧 Mode Debug - Query:', name);
      }

      const descriptionResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_CSE_ID,
          q: name,
          num: 5,
          lr: 'lang_fr',
          safe: 'active'
        }
      });

      // Deuxième appel pour l'image
      const imageResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: process.env.GOOGLE_API_KEY,
          cx: process.env.GOOGLE_CSE_ID,
          q: name,
          num: 5,
          searchType: 'image',
          imgSize: 'large',
          safe: 'active'
        }
      });

      if (isDebugMode) {
        console.log('🔧 Mode Debug - Réponse description:', JSON.stringify(descriptionResponse.data, null, 2));
        console.log('🔧 Mode Debug - Réponse image:', JSON.stringify(imageResponse.data, null, 2));
      }

      let description = null;
      let imageUrl = null;

      // Traitement des résultats de description
      if (descriptionResponse.data?.items?.length > 0) {
        description = descriptionResponse.data.items
          .slice(0, 3)
          .map(item => item.snippet || '')
          .filter(snippet => snippet.length > 50)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();
      }

      // Traitement des résultats d'image
      if (imageResponse.data?.items?.length > 0) {
        const images = imageResponse.data.items;
        for (const item of images) {
          if (item.link && 
              !item.link.includes('logo') && 
              !item.title?.toLowerCase().includes('logo')) {
            imageUrl = item.link;
            console.log('✅ Image trouvée:', imageUrl);
            break;
          }
        }
      }

      if (!imageUrl) {
        console.log('⚠️ Aucune image trouvée dans les résultats');
      }

      if (!description && !imageUrl) {
        return null;
      }

      return { description, imageUrl };
    } catch (error) {
      console.error('❌ Erreur lors de la recherche Google:', error);
      return null;
    }
  }

  async generateSummary(text, isDebugMode) {
    try {
      if (!process.env.HUGGING_FACE_API_KEY) {
        console.log('❌ Erreur : Configuration Hugging Face manquante');
        return null;
      }

      console.log('🤖 Génération du résumé via IA...');
      if (isDebugMode) {
        console.log('🔧 Mode Debug - Texte à résumer:', text);
      }

      const response = await axios.post(
        'https://api-inference.huggingface.co/models/csebuetnlp/mT5_multilingual_XLSum',
        {
          inputs: text,
          parameters: {
            max_length: 250,
            min_length: 50,
            do_sample: false
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (isDebugMode) {
        console.log('🔧 Mode Debug - Réponse de Hugging Face:', JSON.stringify(response.data, null, 2));
      }

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const summary = response.data[0].summary_text || response.data[0].generated_text;
        if (summary) {
          return summary
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 250);
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur lors de la génération du résumé:', error);
      return null;
    }
  }

  generateFromTemplate(name, brand, res, imageUrl = null) {
    const templates = {
      electronics: [
        "[PRODUIT] : une innovation technologique qui redéfinit l'excellence. Profitez d'une expérience utilisateur exceptionnelle grâce à ses fonctionnalités avancées et son design élégant.",
        "Découvrez [PRODUIT], l'alliance parfaite entre performance et style. Un appareil conçu pour répondre aux exigences des utilisateurs les plus exigeants.",
        "Laissez-vous séduire par [PRODUIT], un concentré de technologie dans un design raffiné. La solution idéale pour améliorer votre quotidien."
      ],
      clothing: [
        "[PRODUIT] : l'expression ultime du style et du confort. Une pièce incontournable qui allie élégance et praticité pour une allure impeccable.",
        "Adoptez [PRODUIT], une création qui incarne la mode d'aujourd'hui. Un design contemporain associé à des matériaux de qualité pour un look unique.",
        "Sublimez votre style avec [PRODUIT]. Une coupe moderne et des finitions soignées pour une tenue qui vous met en valeur."
      ],
      default: [
        "[PRODUIT] : l'excellence au service de votre quotidien. Un produit qui combine qualité exceptionnelle et fonctionnalité pour une expérience optimale.",
        "Découvrez [PRODUIT], la référence dans sa catégorie. Une solution complète qui répond à tous vos besoins avec style et efficacité.",
        "Optez pour [PRODUIT], un choix qui fait la différence. Des caractéristiques premium pour des performances qui dépassent vos attentes."
      ]
    };

    const productNameLower = name.toLowerCase();
    const brandLower = (brand || '').toLowerCase();

    const electronicsKeywords = ['phone', 'smartphone', 'ordinateur', 'pc', 'laptop', 'tablette', 'écran', 'tv', 'télé', 'apple', 'samsung', 'sony', 'dell', 'hp', 'lenovo'];
    const clothingKeywords = ['robe', 'pantalon', 'chemise', 'jean', 't-shirt', 'veste', 'manteau', 'zara', 'h&m', 'nike', 'adidas', 'levis'];

    let category = 'default';
    if (electronicsKeywords.some(keyword => productNameLower.includes(keyword) || brandLower.includes(keyword))) {
      category = 'electronics';
    } else if (clothingKeywords.some(keyword => productNameLower.includes(keyword) || brandLower.includes(keyword))) {
      category = 'clothing';
    }

    const selectedTemplates = templates[category];
    const template = selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)];
    const description = template.replace('[PRODUIT]', name);

    console.log(`📝 Description générée depuis template (${category}) :`, description);
    return res.json({ 
      description,
      imageUrl: imageUrl || null,
      detectedBrand: brand || null
    });
  }
}

module.exports = new DescriptionController(); 