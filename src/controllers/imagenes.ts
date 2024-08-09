import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar __dirname para calcular la ruta desde la ubicación del archivo ejecutado
    const uploadPath = path.join(__dirname, '../../imagenes'); 
    // console.log('Saving image to:', uploadPath)

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload.single('imagen');
