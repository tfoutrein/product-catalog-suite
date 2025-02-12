const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'API Catalogue de Produits',
      version: '1.0.0',
      description: 'API RESTful pour la gestion d\'un catalogue de produits et d\'inventaire',
      contact: {
        name: 'Support API',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Identifiant unique de la catégorie'
            },
            name: {
              type: 'string',
              maxLength: 100,
              description: 'Nom de la catégorie'
            },
            description: {
              type: 'string',
              description: 'Description de la catégorie'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création'
            }
          }
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            sub_category_id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              maxLength: 200
            },
            description: {
              type: 'string'
            },
            price: {
              type: 'number',
              format: 'float',
              minimum: 0
            },
            brand: {
              type: 'string',
              maxLength: 100
            },
            image_url: {
              type: 'string',
              format: 'uri'
            },
            weight_volume: {
              type: 'string',
              maxLength: 50
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Inventory: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            name: {
              type: 'string',
              maxLength: 100
            },
            address: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string'
            },
            message: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
};

module.exports = swaggerJsdoc(options); 