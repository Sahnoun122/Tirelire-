import { verifyToken } from '../config/jwt.js';
import User from '../models/user.model.js';

export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token d\'accès requis' });
        }

        const decoded = verifyToken(token);
        
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return res.status(403).json({ message: 'Token invalide ou expiré' });
    }
};

export const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentification requise' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Accès non autorisé' });
        }

        next();
    };
};