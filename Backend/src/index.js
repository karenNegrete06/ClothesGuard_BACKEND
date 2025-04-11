import app from "./app.js";//importar el archivo de app.js
import './database.js';
app.listen(app.get('port'),()=>console.log("server listening on port 3000"));//escucha el servidor peticiones HTTP en el puerto especifico. 