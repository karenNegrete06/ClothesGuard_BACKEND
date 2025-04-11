import notificacionDAO from "../dao/notificacion.dao.js";

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
export const getAllNotificaciones = async (req, res) => {
  try {
    const notificaciones = await notificacionDAO.getAll();
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("❌ Error al obtener las notificaciones:", error);
    res.status(500).json({ error: "Error al obtener las notificaciones." });
  }
};

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
export const getNotificacionById = async (req, res) => {
  const { id } = req.params;
  try {
    const notificacion = await notificacionDAO.getOne(id);
    if (!notificacion) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }
    res.status(200).json(notificacion);
  } catch (error) {
    console.error("❌ Error al obtener la notificación:", error);
    res.status(500).json({ error: "Error al obtener la notificación." });
  }
};

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
export const getNotificacionesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const notificaciones = await notificacionDAO.getByUser(userId);
    res.status(200).json(notificaciones);
  } catch (error) {
    console.error("❌ Error al obtener las notificaciones del usuario:", error);
    res.status(500).json({ error: "Error al obtener las notificaciones del usuario." });
  }
};

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
export const markNotificacionAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedNotificacion = await notificacionDAO.markAsRead(id);
    res.status(200).json(updatedNotificacion);
  } catch (error) {
    console.error("❌ Error al marcar la notificación como leída:", error);
    res.status(500).json({ error: "Error al marcar la notificación como leída." });
  }
};

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
 *               message:
 *                 type: string
 *               read:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Notificación creada
 *       500:
 *         description: Error al crear la notificación
 */
export const createNotificacion = async (req, res) => {
  const notificacionData = req.body;
  try {
    const newNotificacion = await notificacionDAO.insert(notificacionData);
    res.status(201).json(newNotificacion);
  } catch (error) {
    console.error("❌ Error al crear la notificación:", error);
    res.status(500).json({ error: "Error al crear la notificación." });
  }
};

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
export const deleteNotificacion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNotificacion = await notificacionDAO.deleteOne(id);
    if (!deletedNotificacion) {
      return res.status(404).json({ error: "Notificación no encontrada." });
    }
    res.status(200).json({ message: "Notificación eliminada correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar la notificación:", error);
    res.status(500).json({ error: "Error al eliminar la notificación." });
  }
};

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
export const deleteNotificacionesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await notificacionDAO.deleteByUser(userId);
    res.status(200).json({ message: "Notificaciones del usuario eliminadas correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar las notificaciones del usuario:", error);
    res.status(500).json({ error: "Error al eliminar las notificaciones del usuario." });
  }
};