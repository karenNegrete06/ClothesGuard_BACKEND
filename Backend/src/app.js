import express from "express";
import morgan from "morgan";
import userRoutes from './routes/users.routes.js';
import storyRoutes from './routes/story.routes.js'; // Importar rutas de historias
import notificacionRoutes from './routes/notificacion.routes.js'; // Importar rutas de notificaciones
import cors from 'cors';
import dotenv from "dotenv";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import router from "./routes/sensores.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

dotenv.config(); // Cargar variables de entorno

const app = express();

// Obtener la ruta del directorio en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Backend ClothesGuard",
      version: "1.0.0",
      description: "Documentación de la API para el proyecto ClothesGuard",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Ruta a los archivos donde están definidas las rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Agregar un mensaje en la consola para indicar la URL de Swagger
console.log(`Swagger UI disponible en: http://localhost:${process.env.PORT || 3000}/api-docs`);

// Verificar si la carpeta 'uploads/' existe, y si no, crearla
const uploadDirectory = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
  console.log(" Carpeta 'uploads' creada correctamente.");
} else {
  console.log(" Carpeta 'uploads' ya existe.");
}

// Configuración de Multer para manejar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar el tamaño a 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error(" Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF."));
    }
  }
});

// Middleware para manejar la subida de archivos
app.post("/upload", upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "⚠️ No se ha subido ninguna imagen." });
  }
  const imageUrl = `http://${req.hostname}:${app.get('port')}/uploads/${req.file.filename}`;
  console.log(" Imagen subida correctamente:", imageUrl);
  res.json({ message: "Imagen subida con éxito", imageUrl });
});

// Configuración del puerto
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(cors());  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Servir imágenes desde la carpeta "uploads"
app.use('/uploads', express.static(uploadDirectory));
console.log(`Servidor de imágenes activo en: http://localhost:${app.get('port')}/uploads/`);

// Rutas de usuario
app.use("/api/users", userRoutes);

// Rutas para mostrar los sensores
app.use("/api/sensores", router);

// Rutas de historias
app.use("/api/stories", storyRoutes);

// Rutas de notificaciones
app.use("/api/notificaciones", notificacionRoutes);

export default app;
