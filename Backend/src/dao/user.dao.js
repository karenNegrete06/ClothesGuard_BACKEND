const userDAO = {};
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
userDAO.getAll = async () => {
  return await User.find();
};

// Obtener un usuario por ID
userDAO.getOne = async (user_id) => {
  return await User.findOne({ user_id: user_id });
};

// Obtener un usuario por nombre (para login)
userDAO.getByName = async (name) => {
  return await User.findOne({ name: name });
};

// Actualizar solo la imagen de perfil
userDAO.updateProfileImage = async (userId, imagePath) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId, 
      { profileImage: imagePath },  // Guarda la URL de la imagen
      { new: true }  // Devuelve el usuario actualizado
    );

    if (!updatedUser) {
      throw new Error("Usuario no encontrado.");
    }

    return updatedUser;
  } catch (error) {
    console.error("❌ Error al actualizar la imagen de perfil:", error);
    throw error;
  }
};

// Insertar un usuario con contraseña encriptada
userDAO.insert = async (users) => {
  try {
    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password, salt);
    const newUser = await User.create(users);
    return newUser;
  } catch (error) {
    console.error('❌ Error al insertar el usuario:', error);
    throw error;
  }
};

// Actualizar usuario por user_id (UUID)
userDAO.updateOne = async (user, user_id) => {
  // Buscar y actualizar por user_id (que es un String, no un ObjectId)
  return await User.findOneAndUpdate({ user_id: user_id }, user, { new: true });
};


// Eliminar usuario por ID
userDAO.deleteOne = async (user_id) => {
  return await User.findByIdAndDelete(user_id);
};

export default userDAO;

