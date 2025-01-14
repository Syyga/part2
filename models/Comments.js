import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: String, required: true },
  blogId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;
