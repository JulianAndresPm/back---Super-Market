import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers[ 'authorization'];

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // El formato esperado es "Bearer <token>"

        jwt.verify(token, process.env.JWT_KEY as string, (err, user) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token expired' });
                }
                if (err.name === 'JsonWebTokenError') {
                    return res.status(403).json({ message: 'Invalid token' });
                }
                return res.status(403).json({ message: 'Token error' });
            }
            //req.user = user;  // Puedes adjuntar la info del usuario al req
            next();
        
        });
    } else {
        res.status(401).json({ message: 'no autorizado' });
    }
};


export default authenticateJWT;