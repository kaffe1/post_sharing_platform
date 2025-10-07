const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const { validateToken } = require("../midleware/authMiddleware");

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;
  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

router.post("/", validateToken, async (req, res) => {
  const comment = req.body;
  console.log(req.body, "asdf");
  const username = req.user.username;
  comment.username = username;
  await Comments.create(comment);
  const newComment = await Comments.findOne({ order: [["id", "DESC"]] });
  res.json(newComment);
});

router.delete("/:commentId/:postId", validateToken, async (req, res) => {
  const postId = req.params.postId;
  const commentId = req.params.commentId;

  // 用户匹配，可以删除
  await Comments.destroy({ where: { id: commentId } });

  const comments = await Comments.findAll({ where: { PostId: postId } });
  res.json(comments);
});

module.exports = router;
