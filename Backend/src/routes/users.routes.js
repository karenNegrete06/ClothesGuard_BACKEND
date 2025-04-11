import express from "express";
import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import usersController from "../controller/users.controller.js"; // Asegurar ruta correcta

const userRoutes = Router();

// Obtener la ruta del directorio en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads");

// Servir imágenes estáticas
userRoutes.use("/uploads", express.static(uploadDirectory));

// Método de respaldo si una función no está definida en el controlador
const placeholderMethod = (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: "Método no implementado" 
  });
};

/**
 * @swagger
 * /users/getAll:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error al obtener los usuarios
 */
userRoutes.get("/getAll", usersController.getAll || placeholderMethod);

/**
 * @swagger
 * /users/getOne/{user_id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el usuario
 */
userRoutes.get("/getOne/:user_id", usersController.getOne || placeholderMethod);

/**
 * @swagger
 * /users/insert:
 *   post:
 *     summary: Crea un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado
 *       500:
 *         description: Error al crear el usuario
 */
userRoutes.post("/insert", usersController.insert || placeholderMethod);

/**
 * @swagger
 * /users/updateOne/{user_id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       500:
 *         description: Error al actualizar el usuario
 */
userRoutes.put("/updateOne/:user_id", usersController.updateOne || placeholderMethod);

/**
 * @swagger
 * /users/deleteOne/{user_id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 *       500:
 *         description: Error al eliminar el usuario
 */
userRoutes.delete("/deleteOne/:user_id", usersController.deleteOne || placeholderMethod);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error en el servidor
 */
userRoutes.post("/login", usersController.login || placeholderMethod);

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      return cb(new Error("⚠️ Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF."), false);
    }
  }
});

/**
 * @swagger
 * /users/update-photo/{user_id}:
 *   post:
 *     summary: Actualiza la foto de perfil de un usuario
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil del usuario
 *     responses:
 *       200:
 *         description: Imagen de perfil actualizada correctamente
 *       400:
 *         description: No se subió ninguna imagen
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al actualizar la imagen de perfil
 */
userRoutes.post("/update-photo/:user_id", upload.single("profileImage"), async (req, res) => {
  try {
    const user_id = req.params.user_id.trim();

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "⚠️ No se subió ninguna imagen." 
      });
    }

    // Construir la URL de la imagen
    const profileImage = `/uploads/${req.file.filename}`;
    const imageUrl = `${req.protocol}://${req.get("host")}${profileImage}`;

    // Actualizar imagen de perfil en la base de datos
    const updatedUser = await usersController.updateProfileImage(user_id, imageUrl);

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "Usuario no encontrado." 
      });
    }

    res.status(200).json({
      success: true,
      message: "✅ Imagen de perfil actualizada correctamente.",
      imageUrl: imageUrl,
      user: updatedUser
    });

  } catch (error) {
    console.error("🔥 Error al actualizar la imagen de perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la imagen de perfil.",
      error: error.message,
    });
  }
});

export default userRoutes;
