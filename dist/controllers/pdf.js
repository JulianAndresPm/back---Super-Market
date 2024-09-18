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
const puppeteer_1 = __importDefault(require("puppeteer"));
//funcion para generar pdf
const generarPDF = (htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Código para generar PDF
        //lanzar el navegador
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        // Cargar el html en la paguna de puppetear
        yield page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        //generar el PDF
        const pdfBuffer = yield page.pdf({
            format: 'A4',
            printBackground: true // para incluir el diseño CSS
        });
        yield browser.close();
        return generarPDF;
    }
    catch (error) {
        console.error('Error al generar el PDF:', error);
        throw error; // O maneja el error de acuerdo a tus necesidades
    }
});
