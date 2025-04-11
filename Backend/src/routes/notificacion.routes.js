import { Router } from "express";
import {
  getAllNotificaciones,
  getNotificacionById,
  getNotificacionesByUser,
  markNotificacionAsRead,
  createNotificacion,
  deleteNotificacion,
  deleteNotificacionesByUser,
} from "../controller/notificacion.controller.js";

const router = Router();

/**
 * @swagger
 * /notificaciones:
 *   get:
 *     summary: Obtiene todas las notificaciones
 *     responses:
 *       200:
 *         description: Lista de notificaciones
 *       500:
 *         description: Error al obtener las notificaciones
 */
router.get("/", getAllNotificaciones);

/**
 * @swagger
 * /notificaciones/{id}:
 *   get:
 *     summary: Obtiene una notificación por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Detalles de la notificación
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al obtener la notificación
 */
router.get("/:id", getNotificacionById);

/**
 * @swagger
 * /notificaciones/user/{userId}:
 *   get:
 *     summary: Obtiene todas las notificaciones de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de notificaciones del usuario
 *       500:
 *         description: Error al obtener las notificaciones del usuario
 */
router.get("/user/:userId", getNotificacionesByUser);

/**
 * @swagger
 * /notificaciones/{id}/read:
 *   patch:
 *     summary: Marca una notificación como leída
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación marcada como leída
 *       500:
 *         description: Error al marcar la notificación como leída
 */
router.patch("/:id/read", markNotificacionAsRead);

/**
 * @swagger
 * /notificaciones:
 *   post:
 *     summary: Crea una nueva notificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID del usuario
 *               message:
 *                 type: string
 *                 description: Mensaje de la notificación
 *               read:
 *                 type: boolean
 *                 description: Estado de lectura de la notificación
 *     responses:
 *       201:
 *         description: Notificación creada
 *       500:
 *         description: Error al crear la notificación
 */
router.post("/", createNotificacion);

/**
 * @swagger
 * /notificaciones/{id}:
 *   delete:
 *     summary: Elimina una notificación por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notificación
 *     responses:
 *       200:
 *         description: Notificación eliminada correctamente
 *       404:
 *         description: Notificación no encontrada
 *       500:
 *         description: Error al eliminar la notificación
 */
router.delete("/:id", deleteNotificacion);

/**
 * @swagger
 * /notificaciones/user/{userId}:
 *   delete:
 *     summary: Elimina todas las notificaciones de un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Notificaciones del usuario eliminadas correctamente
 *       500:
 *         description: Error al eliminar las notificaciones del usuario
 */
router.delete("/user/:userId", deleteNotificacionesByUser);

export default router;