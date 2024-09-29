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
exports.sendFactura = exports.postFactura = void 0;
const factura_1 = __importDefault(require("../models/factura"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const clientes_1 = __importDefault(require("../models/clientes"));
// Función para generar PDF con Puppeteer
const generarPDF = (htmlContent, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch();
    const page = yield browser.newPage();
    yield page.setContent(htmlContent, { waitUntil: "networkidle0" });
    //Diseño CCS para generar PDF
    yield page.addStyleTag({ content: `

    /* Centra el título de la factura */
.text-center {
  text-align: center;
}

/* Estilos para la cabecera de la factura */
.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f0f0f0; /* Gris claro */
  border-bottom: 1px solid #ddd; /* Línea separadora gris clara */
}

.tituloCliente{
    font-size: medium;
  }

/* Estilos para la alineación de fecha, número de factura y estado */
.accordion-header div {
  flex: 1;
  text-align: center;
}

.accordion-header .d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Agrega espacio entre la fila de encabezado de la tabla y la información de la empresa */
.table{
  margin-top: 20px; 
}


/* Ajustes para el total de cliente */
.card-title {
  text-align: center;
}

.d-flex {
  display: flex;
  justify-content: space-between;
}

.text-end {
  text-align: right;
}

.text-start {
  text-align: left;
}

/* Color de fondo gris para la fila de nombres en la tabla */
.table thead th {
  background-color: #f0f0f0; /* Gris claro */
  border-bottom: 1px solid #ddd; /* Línea separadora gris clara */
}

/* Color de fondo gris para las filas de datos en la tabla */
.table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Gris muy claro */
}

.table tbody tr:nth-child(odd) {
  background-color: #ffffff; /* Blanco para contraste */
}

`
    });
    const pdfsDir = path_1.default.join(__dirname, "../../pdfs");
    // Crear la carpeta si no existe
    if (!fs_1.default.existsSync(pdfsDir)) {
        fs_1.default.mkdirSync(pdfsDir, { recursive: true });
    }
    const filePath = path_1.default.join(pdfsDir, fileName);
    yield page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true,
    });
    yield browser.close();
    return filePath;
});
// Funcion para Enviar los datos de la tabla
const postFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usuario_id, valor_total, htmlContent } = req.body;
    if (!usuario_id || !valor_total || !htmlContent) {
        return res.status(400).json({
            msg: "Faltan datos necesarios para crear la factura",
        });
    }
    try {
        const fileName = `factura_${Date.now()}.pdf`;
        const filePath = yield generarPDF(htmlContent, fileName);
        // Guardar la ruta del PDF en la base de datos
        yield factura_1.default.create({
            usuario_id,
            valor_total,
            pdf: fileName, // Guarda el nombre del archivo PDF
            fecha_compra: new Date(),
        });
        res.json({
            msg: "Factura creada y PDF guardado con éxito",
            pdfPath: filePath,
        });
        // Enviar el correo con la factura al usuario
        yield (0, exports.sendFactura)(usuario_id, filePath);
    }
    catch (error) {
        console.error("Error al agregar la factura:", error);
        res.status(500).json({
            msg: "No fue posible agregar la factura",
            error,
        });
    }
});
exports.postFactura = postFactura;
//Funcion para enviar la factura al cliente
const sendFactura = (usuario_id, facturaPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Iniciando el envío de la factura para el usuario:", usuario_id);
        // Obtener el email del usuario desde la base de datos
        const usuario = yield clientes_1.default.findByPk(usuario_id);
        if (!usuario || !usuario.get('correo')) {
            throw new Error('Usuario no encontrado o sin email');
            return;
        }
        // Mensaje para mostrar el correo electrónico del usuario
        console.log("Correo electrónico del usuario:", usuario.get('correo'));
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "julianandrespazm@gmail.com",
                pass: "cuhj nioq juns wgwv",
            },
        });
        console.log("Transporte SMTP configurado correctamente.");
        // Configurar el mensaje de correo
        const mailOptions = {
            from: '"SuperMarket" <julianandrespazm@gmail.com>', // Cambia "Supermercado" por tu nombre de remitente
            to: usuario.get('correo'), // Correo del usuario
            subject: 'Factura de compra',
            text: 'Adjuntamos su factura de compra. Gracias por su compra!',
            attachments: [
                {
                    filename: `factura_${usuario_id}.pdf`,
                    path: facturaPath, // Ruta del PDF generado
                },
            ],
        };
        // Enviar el correo
        const info = yield transporter.sendMail(mailOptions);
        // Mensaje para confirmar que el correo fue enviado
        console.log("Correo enviado con éxito. ID del mensaje:", info.messageId);
    }
    catch (error) {
        console.error('Error al enviar la factura:', error);
    }
});
exports.sendFactura = sendFactura;
