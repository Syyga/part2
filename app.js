import { DATABASE_URL } from "./env.js";
import express from "express";
import mongoose from "mongoose";
import Blog from "./models/Blogg.js";
import Comment from "./models/Comments.js";

const app = express();
const PORT = 8001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("연결 성공"))
  .catch((err) => console.error("연결 실패:", err));

//블로그 포스트 추가
app.post("/blogs", async (req, res) => {
  const { title, content, author } = req.body;
  if (!title || !content || !author) {
    return res.status(400).send("title, content, author는 필수입니다.");
  }

  try {
    const newBlog = await Blog.create({ title, content, author });
    res.status(201).send(newBlog);
  } catch (err) {
    console.log(err);
    res.status(500).send("에러발생");
  }
});

// 블로그 전체 글 조회
app.get("/blogs", async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const blogs = await Blog.find().limit(limit);
    res.send(blogs);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

// 특정 블로그 글 조회
app.get("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const newBlog = await Blog.findById(id);
    if (!newBlog) {
      return res.status(404).send("에러발생");
    }
    res.send(newBlog);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//특정 글 수정
app.patch("/blogs/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const newBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    );
    if (!newBlog) {
      return res.status(404).send("블로그 글을 찾을 수 없습니다.");
    }
    res.send(newBlog);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//특정 글 삭제
app.delete("/blogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const newBlog = await Blog.findByIdAndDelete(id);
    if (!newBlog) {
      return res.status(404).send({ error: "블로그 글을 찾을 수 없습니다." });
    }
    await Comment.deleteMany({ blogId: id });
    res.send("블로그 글이 삭제되었습니다.");
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//댓글 작성
app.post("/comments", async (req, res) => {
  const { content, author, blogId } = req.body;
  if (!content || !author || !blogId) {
    return res.status(400).send("content, author, blogId는 필수입니다.");
  }

  try {
    const newComment = await Comment.create({ content, author, blogId });
    res.status(201).send(newComment);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//댓글 조회
app.get("/blogs/:id/comments", async (req, res) => {
  const { id } = req.params;

  try {
    const comments = await Comment.find({ blogId: id });
    res.send(comments);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

//댓글 수정
app.patch("/comments/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      { content },
      { new: true, runValidators: true }
    );
    if (!comment) {
      return res.status(404).send("댓글을 찾을 수 없습니다.");
    }
    res.send(comment);
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

// 댓굴 삭제
app.delete("/comments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).send({ error: "댓글을 찾을 수 없습니다." });
    }
    res.send({ message: "댓글이 삭제되었습니다." });
  } catch (err) {
    res.status(500).send("에러발생");
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다`);
});
