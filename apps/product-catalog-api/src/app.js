require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const sequelize = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const productsRouter = require('./routes/productRoutes');
const categoriesRouter = require('./routes/categoryRoutes');
const inventoryRouter = require('./routes/inventoryRoutes');
const descriptionRouter = require('./routes/descriptionRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const descriptionController = require('./controllers/DescriptionController');
const brandController = require('./controllers/BrandController');

const app = express();

// Middleware de base
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost',
    'https://product-catalog-backoffice.vercel.app',
    'https://product-catalog-suite.vercel.app'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Catalogue de Produits - Documentation",
  customfavIcon: "/assets/favicon.ico"
}));

// Route pour télécharger la spécification OpenAPI
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/inventory', inventoryRouter);
app.use('/api/descriptions', descriptionRouter);

// Routes pour les descriptions
app.post('/api/descriptions/generate', descriptionController.generateDescription);

// Routes pour la détection de marque
app.post('/api/brands/detect', brandController.detectBrand);

// Gestion des erreurs
app.use(errorHandler);

// Route 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

const PORT = process.env.PORT || 3000;

// Synchronisation de la base de données et démarrage du serveur
const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Base de données synchronisée avec succès');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
      console.log(`Documentation API disponible sur http://0.0.0.0:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Erreur lors de la synchronisation de la base de données:', error);
    process.exit(1);
  }
};

startServer();
