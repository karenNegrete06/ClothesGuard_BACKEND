//Aqui va la conexión a la base de datos utilizando mongoose
import mongoose from "mongoose";
mongoose.connect('mongodb+srv://KarenNegrete:06karenlizbeth@cluster230570.977pc.mongodb.net/ClothesGuard?retryWrites=true&w=majority&appName=Cluster230570')//invocamos el metodo connect recibe la cadena de conexion
.then((db)=> console.log("Mongodb atlas connected"))//si fue existosa la conexion se mostrara el mensaje
.catch((error)=>console.log(error));//marcara eroror
export default mongoose;