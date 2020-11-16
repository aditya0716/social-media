const mongoose = require("mongoose");
const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: true,
    },
    likeable: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      refPath: "onModel",
    },
    onModel: {
      type: String,
      require: true,
      enum: ["posts", "Comment"],
    },
  },
  {
    timestamps: true,
  }
);
const like = mongoose.model("like", likeSchema);
module.exports = like;
