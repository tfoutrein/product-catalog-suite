const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthController {
  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.authenticateWithGoogle = this.authenticateWithGoogle.bind(this);
  }

  async authenticateWithGoogle(req, res) {
    try {
      const { credential } = req.body;

      // Vérifier le token Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      
      // Trouver ou créer l'utilisateur
      let user = await User.findOne({ where: { email: payload.email } });
      
      if (!user) {
        user = await User.create({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          googleId: payload.sub
        });
      }

      // Générer un JWT avec CLIENT_SECRET
      const token = jwt.sign(
        { 
          id: user.id,
          email: user.email
        },
        process.env.CLIENT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture
        }
      });
    } catch (error) {
      console.error('Erreur d\'authentification Google:', error);
      res.status(401).json({ message: 'Erreur d\'authentification' });
    }
  }
}

module.exports = new AuthController(); 