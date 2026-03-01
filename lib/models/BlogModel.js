import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

const BlogModel = mongoose.models.blog || mongoose.model("blog", Schema);

export default BlogModel;