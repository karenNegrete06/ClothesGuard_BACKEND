 const storyDAO = {};
import Story from "../models/Story.js";

// Obtener todos los historiales
storyDAO.getAll = async () => {
  return await Story.find();
};

// Obtener un historial por ID
storyDAO.getOne = async (story_id) => {
  return await Story.findOne({ story_id: story_id });
};

// Obtener un historial por título
storyDAO.getByTitle = async (title) => {
  return await Story.findOne({ title: title });
};

// Actualizar solo el contenido del historial
storyDAO.updateContent = async (storyId, content) => {
  try {
    const updatedStory = await Story.findByIdAndUpdate(
      storyId,
      { content: content }, // Actualiza el contenido del historial
      { new: true } // Devuelve el historial actualizado
    );

    if (!updatedStory) {
      throw new Error("Historial no encontrado.");
    }

    return updatedStory;
  } catch (error) {
    console.error("❌ Error al actualizar el contenido del historial:", error);
    throw error;
  }
};

// Insertar un nuevo historial
storyDAO.insert = async (story) => {
  try {
    const newStory = await Story.create(story);
    return newStory;
  } catch (error) {
    console.error('❌ Error al insertar el historial:', error);
    throw error;
  }
};

// Actualizar un historial por story_id
storyDAO.updateOne = async (story, story_id) => {
  // Buscar y actualizar por story_id (que es un String, no un ObjectId)
  return await Story.findOneAndUpdate({ story_id: story_id }, story, { new: true });
};

// Eliminar un historial por ID
storyDAO.deleteOne = async (story_id) => {
  return await Story.findByIdAndDelete(story_id);
};

export default storyDAO;