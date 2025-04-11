import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },
    fechaHora: {
      type: Date,
      default: Date.now,
    },
    tipo: {
      type: String,
      required: true, // por ejemplo, "informativa", "alerta", "error"
    },
    leida: {
      type: Boolean,
      default: false, // Indica si la notificación ha sido leída o no
    },
    usuarioId: {
      type: Schema.Types.ObjectId,
      ref: "Usuario", // Relación con el usuario que recibe la notificación
    },
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta"], // Puede ser baja, media o alta según la urgencia
      default: "media",
    },
  },
  {
    versionKey: false,
    timestamps: true, // Esto crea las fechas de creación y actualización automáticamente
  }
);

export default model("Notificacion", notificationSchema);
