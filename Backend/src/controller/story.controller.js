import storyDAO from "../dao/story.dao.js";

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
export const getAllStories = async (req, res) => {
  try {
    const stories = await storyDAO.getAll();
    res.status(200).json(stories);
  } catch (error) {
    console.error("❌ Error al obtener los historiales:", error);
    res.status(500).json({ error: "Error al obtener los historiales." });
  }
};

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
export const getStoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const story = await storyDAO.getOne(id);
    if (!story) {
      return res.status(404).json({ error: "Historial no encontrado." });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error("❌ Error al obtener el historial:", error);
    res.status(500).json({ error: "Error al obtener el historial." });
  }
};

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
export const getStoryByTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const story = await storyDAO.getByTitle(title);
    if (!story) {
      return res.status(404).json({ error: "Historial no encontrado." });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error("❌ Error al obtener el historial por título:", error);
    res.status(500).json({ error: "Error al obtener el historial por título." });
  }
};

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
export const createStory = async (req, res) => {
  const storyData = req.body;
  try {
    const newStory = await storyDAO.insert(storyData);
    res.status(201).json(newStory);
  } catch (error) {
    console.error("❌ Error al crear el historial:", error);
    res.status(500).json({ error: "Error al crear el historial." });
  }
};

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
export const updateStoryContent = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  try {
    const updatedStory = await storyDAO.updateContent(id, content);
    res.status(200).json(updatedStory);
  } catch (error) {
    console.error("❌ Error al actualizar el contenido del historial:", error);
    res.status(500).json({ error: "Error al actualizar el contenido del historial." });
  }
};

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
export const updateStory = async (req, res) => {
  const { id } = req.params;
  const storyData = req.body;
  try {
    const updatedStory = await storyDAO.updateOne(storyData, id);
    if (!updatedStory) {
      return res.status(404).json({ error: "Historial no encontrado." });
    }
    res.status(200).json(updatedStory);
  } catch (error) {
    console.error("❌ Error al actualizar el historial:", error);
    res.status(500).json({ error: "Error al actualizar el historial." });
  }
};

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
export const deleteStory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStory = await storyDAO.deleteOne(id);
    if (!deletedStory) {
      return res.status(404).json({ error: "Historial no encontrado." });
    }
    res.status(200).json({ message: "Historial eliminado correctamente." });
  } catch (error) {
    console.error("❌ Error al eliminar el historial:", error);
    res.status(500).json({ error: "Error al eliminar el historial." });
  }
};