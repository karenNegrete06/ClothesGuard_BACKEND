import { Router } from "express";
import sensorController from "../controller/sensores.controller.js"; // Ruta correcta

const router = Router();

// Asegurar que el controlador tiene las funciones
if (!sensorController.getAll || !sensorController.insert) {
  throw new Error("❌ sensorController no tiene métodos definidos. Revisa sensores.controller.js");
}

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
router.get("/", sensorController.getAll);

/**
 * @swagger
 * /sensores/insertar:
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
router.post("/insertar", sensorController.insert);

export default router;
