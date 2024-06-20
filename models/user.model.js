import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      maxLength: 35,
      minLength: 4,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      maxLength: 50,
      trim: true,
    },
    password: { type: String, required: true, minLength: 6 },
    profilePic: {
      type: String,
      default:
        "https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png",
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
