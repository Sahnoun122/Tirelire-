import jwt from 'jsonwebtoken';

export const generateToken = (payload) => {
    const secret = process.env.JWT_SECRET || 'your-default-secret-key-change-this';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
    
    return jwt.sign(payload, secret, {
        expiresIn: expiresIn,
    });
}

export const verifyToken = (token) => {
    const secret = process.env.JWT_SECRET || 'your-default-secret-key-change-this';
    return jwt.verify(token, secret);
}