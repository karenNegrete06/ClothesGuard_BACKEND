import SensorDAO from "../dao/sensor.dao.js";

const sensorController = {
  /**
   * @swagger
   * /sensores:
   *   post:
   *     summary: Inserta un nuevo registro de sensor o actuador
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nombre:
   *                 type: string
   *                 description: Nombre del sensor o actuador
   *               valor:
   *                 type: number
   *                 description: Valor del sensor o actuador
   *               fechaHora:
   *                 type: string
   *                 format: date-time
   *                 description: Fecha y hora del registro
   *     responses:
   *       201:
   *         description: Dato guardado con éxito
   *       400:
   *         description: Fecha inválida
   *       500:
   *         description: Error al guardar el dato
   */
  async insert(req, res) {
    try {
      if (req.body.fechaHora) {
        const parsedDate = new Date(req.body.fechaHora);
        if (isNaN(parsedDate.getTime())) {
          return res.status(400).json({ error: "❌ Fecha inválida" });
        }
        req.body.fechaHora = parsedDate;
      }

      const nuevoRegistro = await SensorDAO.insert(req.body);
      res.status(201).json({ mensaje: "✅ Dato guardado con éxito", data: nuevoRegistro });
    } catch (error) {
      console.error("❌ Error al insertar sensor/actuador:", error);
      res.status(500).json({ error: "❌ Error al guardar el dato" });
    }
  },

  /**
   * @swagger
   * /sensores:
   *   get:
   *     summary: Obtiene todos los registros de sensores o actuadores
   *     responses:
   *       200:
   *         description: Lista de registros
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: string
   *                         description: ID del registro
   *                       nombre:
   *                         type: string
   *                         description: Nombre del sensor o actuador
   *                       valor:
   *                         type: number
   *                         description: Valor del sensor o actuador
   *                       fechaHora:
   *                         type: string
   *                         format: date-time
   *                         description: Fecha y hora del registro
   *       500:
   *         description: Error al obtener los datos
   */
  async getAll(req, res) {
    try {
      const datos = await SensorDAO.getAll();
      res.json({ data: datos });
    } catch (error) {
      console.error("❌ Error al obtener sensores/actuadores:", error);
      res.status(500).json({ error: "❌ Error al obtener los datos" });
    }
  }
};

export default sensorController;
