const notificacionDAO = {};
import Notificacion from "../models/Notificacion.js";

// Obtener todas las notificaciones
notificacionDAO.getAll = async () => {
  return await Notificacion.find();
};

// Obtener una notificación por ID
notificacionDAO.getOne = async (notificacion_id) => {
  return await Notificacion.findById(notificacion_id);
};

// Obtener notificaciones por usuario
notificacionDAO.getByUser = async (user_id) => {
  return await Notificacion.find({ user_id: user_id });
};

// Marcar una notificación como leída
notificacionDAO.markAsRead = async (notificacionId) => {
  try {
    const updatedNotificacion = await Notificacion.findByIdAndUpdate(
      notificacionId,
      { read: true }, // Marca la notificación como leída
      { new: true } // Devuelve la notificación actualizada
    );

    if (!updatedNotificacion) {
      throw new Error("Notificación no encontrada.");
    }

    return updatedNotificacion;
  } catch (error) {
    console.error("❌ Error al marcar la notificación como leída:", error);
    throw error;
  }
};

// Insertar una nueva notificación
notificacionDAO.insert = async (notificacion) => {
  try {
    const newNotificacion = await Notificacion.create(notificacion);
    return newNotificacion;
  } catch (error) {
    console.error("❌ Error al insertar la notificación:", error);
    throw error;
  }
};

// Eliminar una notificación por ID
notificacionDAO.deleteOne = async (notificacion_id) => {
  return await Notificacion.findByIdAndDelete(notificacion_id);
};

// Eliminar todas las notificaciones de un usuario
notificacionDAO.deleteByUser = async (user_id) => {
  return await Notificacion.deleteMany({ user_id: user_id });
};

export default notificacionDAO;