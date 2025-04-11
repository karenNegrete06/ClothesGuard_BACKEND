import { model, Schema } from "mongoose";

const sensorSchema = new Schema(
  {
    tipo: {
      type: String,
      required: true,
    },
    nombre: {
      type: String, 
      required: true,
    },
    valor: {
      type: Schema.Types.Mixed, 
      required: true,
    },
    unidad: {
      type: String, 
      default: "", 
    },
    accion: {
      type: String, 
      default: "", 
    },
    fechaHora: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);

export default model("SensorActuador", sensorSchema);

