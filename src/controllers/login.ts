import { Request, Response } from "express";
import usuarioAdmin from "../models/usuarios_admin";
import clientes from "../models/clientes";
import jwt, { Secret } from 'jsonwebtoken';

// Validar el inicio de sesión - login
export const login = async (req: Request, res: Response) => {
    const KEY = process.env.JWT_KEY;

    const { usuario, passw } = req.body;

    try {
        // Buscar al usuario en la tabla de administradores
        const admin = await usuarioAdmin.findOne({ where: { usuario, passw } });
        if (admin) {
            // Usuario encontrado en admin
            const accesstoken = jwt.sign(
                { usuario: admin.get('usuario'), rol: admin.get('rol'), info: admin },
                KEY as Secret,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                message: 'Login successful admin',
                accesstoken,
                UserType: admin.get('rol'),
                admin
            });
        }

        // Si no se encuentra en administradores, buscar en clientes
        const cliente = await clientes.findOne({ where: { usuario, contrasena: passw } });
        if (cliente) {
            // Usuario encontrado en cliente
            const accesstoken = jwt.sign(
                { usuario: cliente.get('id'), rol: 'cliente', info: cliente},
                KEY as Secret,
                { expiresIn: '1h' }
            );
            return res.status(200).json({
                message: 'Login successful cliente',
                accesstoken,
                UserType: 'cliente',
                cliente
            });
        }

        // Si no se encuentra el usuario en ninguna tabla
        return res.status(401).json({ message: 'Invalid credentials' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};
