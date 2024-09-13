import dotenv from 'dotenv';
import serverInstance from './models/server'; // Asegúrate de que esta ruta sea correcta

// Configuración de las variables de entorno
dotenv.config();

// Usar la instancia directamente, sin 'new'
serverInstance.listen();
