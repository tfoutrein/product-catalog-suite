const axios = require('axios');

class BrandController {
  constructor() {
    this.detectBrand = this.detectBrand.bind(this);
    
    // Liste des marques connues organisées par catégorie
    this.brandsByCategory = {
      tech: [
        // Smartphones et électronique grand public
        'samsung', 'apple', 'huawei', 'xiaomi', 'oppo', 'vivo', 'oneplus', 'sony', 'lg', 'motorola',
        'nokia', 'google', 'realme', 'zte', 'honor', 'nothing', 'blackberry', 'alcatel',
        
        // Ordinateurs et périphériques
        'hp', 'dell', 'lenovo', 'asus', 'acer', 'msi', 'toshiba', 'fujitsu', 'razer', 'microsoft',
        'logitech', 'corsair', 'intel', 'amd', 'nvidia', 'seagate', 'western digital', 'kingston',
        'crucial', 'steelseries', 'roccat', 'benq', 'viewsonic',
        
        // Audio
        'bose', 'sennheiser', 'jabra', 'jbl', 'beats', 'marshall', 'bang & olufsen', 'yamaha', 
        'pioneer', 'denon', 'audio-technica', 'shure', 'ultimate ears', 'skullcandy',
        
        // TV et Home Cinema
        'philips', 'panasonic', 'tcl', 'hisense', 'sharp', 'grundig', 'thomson', 'toshiba', 'vizio'
      ],
      
      fashion: [
        // Sport
        'nike', 'adidas', 'puma', 'reebok', 'asics', 'new balance', 'under armour', 'fila', 'converse',
        'vans', 'jordan', 'salomon', 'the north face', 'columbia', 'timberland',
        
        // Mode
        'zara', 'h&m', 'uniqlo', 'levis', 'gap', 'lacoste', 'ralph lauren', 'tommy hilfiger', 
        'calvin klein', 'guess', 'diesel', 'g-star', 'superdry', 'hollister', 'abercrombie',
        'balenciaga', 'gucci', 'prada', 'versace', 'armani', 'hugo boss', 'burberry', 'hermès',
        'louis vuitton', 'chanel', 'dior', 'yves saint laurent', 'fendi', 'valentino', 'cartier',
        'rolex', 'omega', 'tag heuer', 'tissot', 'seiko', 'casio', 'fossil',
        
        // Fast Fashion
        'primark', 'forever 21', 'urban outfitters', 'asos', 'boohoo', 'mango', 'bershka', 
        'pull&bear', 'stradivarius', 'massimo dutti'
      ],
      
      beauty: [
        // Cosmétiques et soins
        'loreal', 'maybelline', 'nyx', 'revlon', 'mac', 'estee lauder', 'clinique', 'lancome',
        'shiseido', 'nivea', 'dove', 'garnier', 'olay', 'vichy', 'la roche-posay', 'avene',
        'bioderma', 'cerave', 'neutrogena', 'kiehls', 'the ordinary', 'fenty beauty', 'nars',
        'urban decay', 'too faced', 'benefit', 'yves rocher', 'clarins', 'biotherm'
      ],
      
      food: [
        // Alimentation et boissons
        'coca-cola', 'pepsi', 'nestle', 'danone', 'kelloggs', 'kraft', 'heinz', 'unilever',
        'mars', 'ferrero', 'mondelez', 'general mills', 'campbell', 'hershey', 'red bull',
        'starbucks', 'mcdonalds', 'burger king', 'subway', 'kfc', 'pizza hut', 'dominos'
      ],
      
      home: [
        // Maison et déco
        'ikea', 'conforama', 'but', 'maisons du monde', 'habitat', 'fly', 'alinea',
        'leroy merlin', 'castorama', 'brico depot', 'mr bricolage', 'lapeyre',
        'dyson', 'bosch', 'siemens', 'miele', 'electrolux', 'whirlpool', 'samsung', 'lg',
        'moulinex', 'seb', 'tefal', 'krups', 'delonghi', 'philips', 'braun', 'karcher'
      ],
      
      auto: [
        // Automobile
        'toyota', 'volkswagen', 'ford', 'honda', 'hyundai', 'bmw', 'mercedes', 'audi',
        'porsche', 'ferrari', 'lamborghini', 'maserati', 'tesla', 'volvo', 'jaguar',
        'land rover', 'mini', 'fiat', 'alfa romeo', 'peugeot', 'renault', 'citroen',
        'opel', 'seat', 'skoda', 'kia', 'mazda', 'subaru', 'lexus', 'infiniti'
      ],
      
      gaming: [
        // Jeux vidéo
        'nintendo', 'playstation', 'xbox', 'sega', 'atari', 'bandai', 'namco', 'konami',
        'capcom', 'square enix', 'electronic arts', 'ubisoft', 'activision', 'blizzard',
        'bethesda', 'rockstar', 'valve', 'epic games', '2k games', 'thq'
      ]
    };

    // Créer une liste plate de toutes les marques pour la recherche
    this.knownBrands = Object.values(this.brandsByCategory)
      .flat()
      .sort((a, b) => b.length - a.length); // Trier par longueur décroissante pour matcher les noms les plus longs d'abord
  }

  async detectBrand(req, res) {
    try {
      const { name } = req.body;
      const isDebugMode = process.env.DEBUG_MODE === 'true';

      if (!name) {
        console.log('❌ Erreur : Le nom du produit est requis');
        return res.status(400).json({ message: 'Le nom du produit est requis' });
      }

      console.log('🔍 Détection de la marque...');
      if (isDebugMode) {
        console.log('🔧 Mode Debug - Nom du produit:', name);
      }

      // Convertir le nom en minuscules pour la comparaison
      const nameLower = name.toLowerCase();
      const words = nameLower.split(/[\s-]+/);

      // 1. Vérifier d'abord dans la liste des marques connues
      for (const brand of this.knownBrands) {
        if (nameLower.includes(brand)) {
          // Gestion spéciale pour les marques avec des caractères spéciaux
          let detectedBrand = brand;
          
          // Gestion des marques avec '&'
          if (brand.includes('&')) {
            detectedBrand = brand.split('&').map(part => 
              part.trim().charAt(0).toUpperCase() + part.trim().slice(1)
            ).join('&');
          } 
          // Gestion des marques avec plusieurs mots
          else if (brand.includes(' ')) {
            detectedBrand = brand.split(' ').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          }
          // Marques simples
          else {
            detectedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);
          }

          console.log('✨ Marque détectée (liste connue):', detectedBrand);
          return res.json({ brand: detectedBrand });
        }
      }

      // 2. Si aucune marque connue n'est trouvée, prendre le premier mot significatif
      const ignoreWords = [
        'le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'pour', 'avec',
        'par', 'sur', 'dans', 'en', 'vers', 'chez', 'nouveau', 'nouvelle',
        'nouveaux', 'nouvelles', 'petit', 'petite', 'petits', 'petites',
        'grand', 'grande', 'grands', 'grandes'
      ];
      
      for (const word of words) {
        const cleanWord = word.trim();
        if (!ignoreWords.includes(cleanWord) && cleanWord.length > 1) {
          const detectedBrand = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);
          console.log('✨ Marque détectée (premier mot):', detectedBrand);
          return res.json({ brand: detectedBrand });
        }
      }

      console.log('⚠️ Aucune marque détectée');
      return res.json({ brand: null });
    } catch (error) {
      console.error('❌ Erreur lors de la détection de la marque:', error);
      return res.status(500).json({ message: 'Erreur lors de la détection de la marque' });
    }
  }
}

module.exports = new BrandController(); 