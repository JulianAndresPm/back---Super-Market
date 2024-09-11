import express, { Application, Request, Response } from 'express'
import routesProd from '../routes/productos'
import routesAdmin from '../routes/admin'
import routesClientes from '../routes/clientes'
import routesLogin from '../routes/login'
import routesCarrito from '../routes/carrito'
import db from '../db/conexion'
import cors from 'cors'
import path from 'path'
import morgan  from 'morgan'



class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlerwares();
        this.routes();
        this.testConnection();

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("puerto: " + this.port);

        })
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'yes'
            })
        })

        //rutas para acceso al crud de productos
        this.app.use('/api/productos', routesProd)

        // Ruta para crud de administradores
        this.app.use('/api/admin', routesAdmin);

        //Ruta para crud de usuarios(clientes)
        this.app.use('/api/clientes', routesClientes);

        //Ruta para crud de carrito
        this.app.use('/api/carrito', routesCarrito);

        //Ruta para validar el login
        this.app.use('/api/login',routesLogin )


        // Servir archivos estáticos desde la carpeta 'imagenes'
        this.app.use('/imagenes', express.static(path.join(__dirname, '../../imagenes')));
        this.app.use('/fotosAdmin', express.static(path.join(__dirname, '../../fotos_usuarios')));
        this.app.use('/fotosClientes', express.static(path.join(__dirname, '../../fotos_clientes')));
    }

    midlerwares() {
        //visualizar las peticiones
        this.app.use(morgan('combined'));
        //pasar los datos
        this.app.use(express.json());
        //cors
        this.app.use(cors());

    }

    //------------------------------------
    async testConnection() {
        try {
            // Sincroniza la base de datos con el modelo
            await db.sync({ alter: true });
            console.log('Base de datos sincronizada');

            await db.authenticate();
            console.log('Conectado exitosamente.');

        } catch (error) {
            console.error('Ocurrio un error ', error);
        }
    }

}

export default Server;