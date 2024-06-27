import mongoose from "mongoose";
import { Schema, model } from "mongoose";

const stratagemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    damage: {
      type: Number,
    },
    cooldown: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    uses: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rank: {
      type: String,
      enum: [
        "Cadet",
        "Space Cadet",
        "Sergeant",
        "Chief",
        "Space Chief Prime",
        "Death Captain",
      ],
    },
    cost: {
      type: Number,
    },
    image: {
      type: String,
      default: "",
    },
    penetration: {
      type: String,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

export default model("Stratagem", stratagemSchema);
