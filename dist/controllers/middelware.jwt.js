"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // El formato esperado es "Bearer <token>"
        jsonwebtoken_1.default.verify(token, process.env.JWT_KEY, (err, user) => {
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
    }
    else {
        res.status(401).json({ message: 'no autorizado' });
    }
};
exports.authenticateJWT = authenticateJWT;
exports.default = exports.authenticateJWT;
