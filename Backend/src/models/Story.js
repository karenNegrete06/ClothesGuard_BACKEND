import { model, Schema } from "mongoose";

const storySchema = new Schema(
  {
    dia: {
      type: Date,
      required: true, 
    },
    horasUso: {
      type: String, 
      required: true,
    },
    indicaciones: {
      type: String,
    },
    diasActivos: {
      type: Date, 
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true, 
  }
);

export default model("Story", storySchema);
