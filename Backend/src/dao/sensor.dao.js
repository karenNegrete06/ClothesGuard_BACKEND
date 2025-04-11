import SensorActuador from "../models/SensorActuador.js";

const SensorDAO = {
  async insert(data) {
    try {
      // Si no hay fechaHora, usar la actual
      if (!data.fechaHora) {
        data.fechaHora = new Date();
      }

      const nuevoRegistro = new SensorActuador(data);
      return await nuevoRegistro.save();
    } catch (error) {
      console.error("❌ Error al insertar sensor/actuador:", error);
      throw error;
    }
  },

  async getAll() {
    try {
      return await SensorActuador.find().sort({ fechaHora: -1 });
    } catch (error) {
      console.error("❌ Error al obtener sensores/actuadores:", error);
      throw error;
    }
  }
};

export default SensorDAO;
