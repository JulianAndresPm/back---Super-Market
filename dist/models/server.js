"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const productos_1 = __importDefault(require("../routes/productos"));
const admin_1 = __importDefault(require("../routes/admin"));
const clientes_1 = __importDefault(require("../routes/clientes"));
const login_1 = __importDefault(require("../routes/login"));
const carrito_1 = __importDefault(require("../routes/carrito"));
const factura_1 = __importDefault(require("../routes/factura"));
const conexion_1 = __importDefault(require("../db/conexion"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http"); // Importar el servidor HTTP de Node.js
const socket_io_1 = require("socket.io"); // Importar Socket.IO
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        // Crear servidor HTTP y Socket.IO
        this.server = (0, http_1.createServer)(this.app); // Crear servidor HTTP
        this.io = new socket_io_1.Server(this.server, {
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
        });
    }
    sockets() {
        this.io.on('connection', (socket) => {
            console.log('Nuevo cliente conectado', socket.id);
            // Confirmar que se ha establecido la conexión
            socket.emit('conectado', { msg: 'Conectado exitosamente al servidor', });
            socket.on('disconnect', () => {
                console.log('Cliente desconectado: ', socket.id);
            });
        });
    }
    getIo() {
        return this.io;
    }
    //rutas 
    routes() {
        this.app.get('/', (req, res) => {
            res.json({
                msg: 'yes'
            });
        });
        //rutas para acceso al crud de productos
        this.app.use('/api/productos', productos_1.default);
        // Ruta para crud de administradores
        this.app.use('/api/admin', admin_1.default);
        //Ruta para crud de usuarios(clientes)
        this.app.use('/api/clientes', clientes_1.default);
        //Ruta para crud de carrito
        this.app.use('/api/carrito', carrito_1.default);
        //Ruta para validar el login
        this.app.use('/api/login', login_1.default);
        //Ruta para la factura
        this.app.use('/api/factura', factura_1.default);
        // Servir archivos estáticos desde la carpeta 'imagenes'
        this.app.use('/imagenes', express_1.default.static(path_1.default.join(__dirname, '../../imagenes')));
        this.app.use('/fotosAdmin', express_1.default.static(path_1.default.join(__dirname, '../../fotos_usuarios')));
        this.app.use('/fotosClientes', express_1.default.static(path_1.default.join(__dirname, '../../fotos_clientes')));
    }
    midlerwares() {
        // //visualizar las peticiones
        // this.app.use(morgan('combined'));
        //pasar los datos
        this.app.use(express_1.default.json());
        //cors
        this.app.use((0, cors_1.default)());
    }
    //-------------------------------------------
    //------------------------------------
    testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Sincroniza la base de datos con el modelo
                yield conexion_1.default.sync({ alter: true });
                console.log('Base de datos sincronizada');
                yield conexion_1.default.authenticate();
                console.log('Conectado exitosamente.');
            }
            catch (error) {
                console.error('Ocurrio un error ', error);
            }
        });
    }
}
const serverInstance = new Server(); // Crear la instancia del servidor
exports.io = serverInstance.getIo(); // Exportar la instancia de io
exports.default = serverInstance; // Exportar la instancia del servidor
