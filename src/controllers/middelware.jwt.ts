import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // El formato esperado es "Bearer <token>"

        jwt.verify(token, process.env.JWT_KEY as string, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            
            // Adjunta la información del usuario verificado al objeto req
            // req.user = user;
            next();
        });
    } else {
        res.status(401).json({ message: 'no autorizado' });
    }
};


export default authenticateJWT;