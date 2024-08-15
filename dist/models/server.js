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
const express_1 = __importDefault(require("express"));
const productos_1 = __importDefault(require("../routes/productos"));
const admin_1 = __importDefault(require("../routes/admin"));
const clientes_1 = __importDefault(require("../routes/clientes"));
const conexion_1 = __importDefault(require("../db/conexion"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
class Server {
    constructor() {
        console.log();
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.midlerwares();
        this.routes();
        this.testConnection();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("puerto: " + this.port);
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.json({
                msg: 'yes'
            });
        });
        //rutas para acceso al crud de productso
        this.app.use('/api/productos', productos_1.default);
        // Ruta para crud de administradores
        this.app.use('/api/admin', admin_1.default);
        //Ruta para crud de usuarios(clientes)
        this.app.use('/api/clientes', clientes_1.default);
        // Servir archivos estáticos desde la carpeta 'imagenes'
        this.app.use('/imagenes', express_1.default.static(path_1.default.join(__dirname, '../../imagenes')));
    }
    midlerwares() {
        //pasar los datos de los productos
        this.app.use(express_1.default.json());
        //cors
        this.app.use((0, cors_1.default)());
    }
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
exports.default = Server;
