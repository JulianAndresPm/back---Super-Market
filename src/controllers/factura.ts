import { Request, Response } from "express";
import Factura from "../models/factura";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import nodemailer from 'nodemailer';
import clientes from "../models/clientes";


// Función para generar PDF con Puppeteer
const generarPDF = async (
  htmlContent: string,
  fileName: string
): Promise<string> => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  //Diseño CCS para generar PDF
  await page.addStyleTag({content:`

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
  })

  const pdfsDir = path.join(__dirname, "../../pdfs");
  // Crear la carpeta si no existe
  if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
  }

  const filePath = path.join(pdfsDir, fileName);

  await page.pdf({
    path: filePath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return filePath;
};

// Funcion para Enviar los datos de la tabla
export const postFactura = async (req: Request, res: Response) => {
  const { usuario_id, valor_total, htmlContent } = req.body;

  if (!usuario_id || !valor_total || !htmlContent) {
    return res.status(400).json({
      msg: "Faltan datos necesarios para crear la factura",
    });
  }

  try {
    const fileName = `factura_${Date.now()}.pdf`;
    const filePath = await generarPDF(htmlContent, fileName);

    // Guardar la ruta del PDF en la base de datos
    await Factura.create({
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
    await sendFactura(usuario_id, filePath);

  } catch (error) {
    console.error("Error al agregar la factura:", error);
    res.status(500).json({
      msg: "No fue posible agregar la factura",
      error,
    });
  }
};

//Funcion para enviar la factura al cliente

export const sendFactura = async(usuario_id: number, facturaPath: string)=> {

  try {

    console.log("Iniciando el envío de la factura para el usuario:", usuario_id);

    // Obtener el email del usuario desde la base de datos
    const usuario = await clientes.findByPk(usuario_id);
    
    if (!usuario || !usuario.get('correo')) {
      throw new Error('Usuario no encontrado o sin email');
      return;
    }

     // Mensaje para mostrar el correo electrónico del usuario
     console.log("Correo electrónico del usuario:", usuario.get('correo'));

    const transporter =  nodemailer.createTransport({
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
        from: '"SuperMarket" <julianandrespazm@gmail.com>',  // Cambia "Supermercado" por tu nombre de remitente
        to: usuario.get('correo') as string,  // Correo del usuario
        subject: 'Factura de compra',
        text: 'Adjuntamos su factura de compra. Gracias por su compra!',
        attachments: [
          {
            filename: `factura_${usuario_id}.pdf`,
            path: facturaPath,  // Ruta del PDF generado
          },
        ],
      };

     // Enviar el correo

     const info = await transporter.sendMail(mailOptions);
     // Mensaje para confirmar que el correo fue enviado
     console.log("Correo enviado con éxito. ID del mensaje:", info.messageId);       
     

  } catch (error) {
    console.error('Error al enviar la factura:', error);
  }
};


