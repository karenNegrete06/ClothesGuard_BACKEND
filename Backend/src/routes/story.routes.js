import { Router } from "express";
import {
  getAllStories,
  getStoryById,
  getStoryByTitle,
  createStory,
  updateStoryContent,
  updateStory,
  deleteStory,
} from "../controller/story.controller.js";

const router = Router();

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Obtiene todos los historiales
 *     responses:
 *       200:
 *         description: Lista de historiales
 *       500:
 *         description: Error al obtener los historiales
 */
router.get("/", getAllStories);

/**
 * @swagger
 * /stories/{id}:
 *   get:
 *     summary: Obtiene un historial por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Detalles del historial
 *       404:
 *         description: Historial no encontrado
 *       500:
 *         description: Error al obtener el historial
 */
router.get("/:id", getStoryById);

/**
 * @swagger
 * /stories/title/{title}:
 *   get:
 *     summary: Obtiene un historial por título
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Título del historial
 *     responses:
 *       200:
 *         description: Detalles del historial
 *       404:
 *         description: Historial no encontrado
 *       500:
 *         description: Error al obtener el historial por título
 */
router.get("/title/:title", getStoryByTitle);

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Crea un nuevo historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del historial
 *               content:
 *                 type: string
 *                 description: Contenido del historial
 *     responses:
 *       201:
 *         description: Historial creado
 *       500:
 *         description: Error al crear el historial
 */
router.post("/", createStory);

/**
 * @swagger
 * /stories/{id}/content:
 *   patch:
 *     summary: Actualiza solo el contenido de un historial
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: Nuevo contenido del historial
 *     responses:
 *       200:
 *         description: Contenido actualizado
 *       500:
 *         description: Error al actualizar el contenido
 */
router.patch("/:id/content", updateStoryContent);

/**
 * @swagger
 * /stories/{id}:
 *   put:
 *     summary: Actualiza un historial completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título del historial
 *               content:
 *                 type: string
 *                 description: Contenido del historial
 *     responses:
 *       200:
 *         description: Historial actualizado
 *       404:
 *         description: Historial no encontrado
 *       500:
 *         description: Error al actualizar el historial
 */
router.put("/:id", updateStory);

/**
 * @swagger
 * /stories/{id}:
 *   delete:
 *     summary: Elimina un historial por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del historial
 *     responses:
 *       200:
 *         description: Historial eliminado correctamente
 *       404:
 *         description: Historial no encontrado
 *       500:
 *         description: Error al eliminar el historial
 */
router.delete("/:id", deleteStory);

export default router;