import express, { Application, Request, Response } from 'express'
import routesProd from '../routes/productos'
import db from '../db/conexion'
import cors from 'cors'


class Server {
    private app: Application;
    private port: string;

    constructor() {
        console.log();
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
        this.app.use('/api/productos', routesProd)
    }

    midlerwares() {

        //pasar los datos de los productos
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