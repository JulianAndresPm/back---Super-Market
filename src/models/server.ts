import express, { Application, Request, Response } from 'express'
import routesProd from '../routes/productos'
import routesAdmin from '../routes/admin'
import routesClientes from '../routes/clientes'
import routesLogin from '../routes/login'
import routesCarrito from '../routes/carrito'
import routesFactura from '../routes/factura'
import db from '../db/conexion'
import cors from 'cors'
import path from 'path'
import morgan  from 'morgan'
import { createServer } from 'http'; // Importar el servidor HTTP de Node.js
import { Server as SocketIOServer, Socket } from 'socket.io'; // Importar Socket.IO



class Server {
    private app: Application;
    private port: string;
    private io: SocketIOServer; // Agregar Socket.IO
    private server: any; // Agregar servidor HTTP

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';

        // Crear servidor HTTP y Socket.IO
        this.server = createServer(this.app); // Crear servidor HTTP
        this.io = new SocketIOServer(this.server, {
            cors: {
              origin: "http://localhost:4200", // URL de tu frontend Angular
              methods: ["GET", "POST", "DELETE", "PUT"]
            }
          });
          

        this.midlerwares();
        this.routes();
        this.sockets(); 
        this.testConnection();

    }

    listen() {
        this.server.listen(this.port, () => {
            console.log("Servidor Corriendo en el puerto: " + this.port);

        })
    }

    sockets(){
        this.io.on('connection', (socket: Socket)=>{
            console.log('Nuevo cliente conectado', socket.id);
            // Confirmar que se ha establecido la conexión
             socket.emit('conectado', { msg: 'Conectado exitosamente al servidor',  });

            socket.on('disconnect', ()=>{
                console.log('Cliente desconectado: ', socket.id); 
            });
        });
    }
    
    getIo(){
        return this.io;
    }

    //rutas 
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
        this.app.use('/api/login',routesLogin );

        //Ruta para la factura
        this.app.use('/api/factura', routesFactura);


        // Servir archivos estáticos desde la carpeta 'imagenes'
        this.app.use('/imagenes', express.static(path.join(__dirname, '../../imagenes')));
        this.app.use('/fotosAdmin', express.static(path.join(__dirname, '../../fotos_usuarios')));
        this.app.use('/fotosClientes', express.static(path.join(__dirname, '../../fotos_clientes')));
    }

    midlerwares() {
        // //visualizar las peticiones
        // this.app.use(morgan('combined'));
        //pasar los datos
        this.app.use(express.json());
        //cors
        this.app.use(cors());

    }

    //-------------------------------------------
   
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

const serverInstance = new Server(); // Crear la instancia del servidor
export const io = serverInstance.getIo(); // Exportar la instancia de io
export default serverInstance; // Exportar la instancia del servidor



