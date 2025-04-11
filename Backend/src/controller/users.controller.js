import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import userDAO from "../dao/user.dao.js";
import UserModel from "../models/User.js";

const usersController = {};

// Obtener la ruta del directorio en ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "..", "uploads");

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
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
      return cb(new Error("⚠️ Solo se permiten imágenes en formato JPEG, JPG, PNG o GIF."));
    }
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *       500:
 *         description: Error al obtener los usuarios
 */
usersController.getAll = (req, res) => {
  userDAO.getAll()
    .then((users) => res.json({ data: users }))
    .catch((error) => res.status(500).json({ data: { message: error.message } }));
};

/**
 * @swagger
 * /users/{user_id}:
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
usersController.getOne = (req, res) => {
  userDAO.getOne(req.params.user_id)
    .then((user) => {
      if (user) {
        res.json({ data: user });
      } else {
        res.status(404).json({ data: { message: "Usuario no encontrado" } });
      }
    })
    .catch((error) => res.status(500).json({ data: { message: error.message } }));
};

/**
 * @swagger
 * /users:
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
usersController.insert = (req, res) => {
  userDAO.insert(req.body)
    .then((user) => res.status(201).json(user))
    .catch((error) => res.status(500).json({ data: { message: error.message } }));
};

/**
 * @swagger
 * /users/{user_id}:
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
usersController.updateOne = (req, res) => {
  const userId = req.params.user_id;
  const updatedData = req.body;

  userDAO.updateOne(updatedData, userId)
    .then((result) => res.json({ data: { message: "Usuario actualizado con éxito", result } }))
    .catch((error) => res.status(500).json({ data: { message: error.message } }));
};

/**
 * @swagger
 * /users/{user_id}:
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
usersController.deleteOne = (req, res) => {
  userDAO.deleteOne(req.params.user_id)
    .then((userDeleted) => res.json({ data: { message: "Usuario eliminado con éxito", user_deleted: userDeleted } }))
    .catch((error) => res.status(500).json({ data: { message: error.message } }));
};

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
usersController.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await userDAO.getByName(name);

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.user_id }, 'SECRET_KEY', { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, userId: user.user_id });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

// Método para actualizar imagen de perfil
usersController.updateProfileImage = async (user_id, imageUrl) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { user_id: user_id }, 
      { profileImage: imageUrl }, 
      { new: true }
    );

    return user;
  } catch (error) {
    throw new Error("Error al actualizar la imagen de perfil: " + error.message);
  }
};

// Crear el router de imágenes de perfil
const router = express.Router();

// Ruta para actualizar imagen de perfil
router.post("/:user_id/upload", upload.single("profileImage"), async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "⚠️ No se subió ninguna imagen." });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    // Actualizar imagen en la base de datos
    const updatedUser = await UserModel.findOneAndUpdate(
      { user_id: user_id }, 
      { profileImage: imageUrl }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    console.log("✅ Imagen de perfil actualizada:", imageUrl);

    res.status(200).json({
      message: "Imagen de perfil actualizada correctamente",
      profileImage: imageUrl,
      user: updatedUser
    });

  } catch (error) {
    console.error("🔥 Error al actualizar la imagen de perfil:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

// Ruta para actualizar los datos del usuario
router.put("/:user_id", async (req, res) => {
  const { name, email, address } = req.body;

  try {
    const user = await UserModel.findOneAndUpdate(
      { user_id: req.params.user_id },
      { name, email, address },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Datos del usuario actualizados correctamente",
      user,
    });
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

// Agregar el router al controlador
usersController.router = router;

export default usersController;
