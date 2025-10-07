const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const { validateToken } = require("../midleware/authMiddleware");

router.get("/", async (req, res) => {
  const postList = await Posts.findAll({ include: [Likes] });
  res.json(postList);
});
router.get("/ById/:id", async (req, res) => {
  const id = req.params.id;
  const post = await Posts.findByPk(id);
  res.json(post);
});
router.get("/byUserId/:id", async (req, res) => {
  const id = req.params.id;
  const postList = await Posts.findAll({ where: { UserId: id } });
  res.json(postList);
});
router.delete("/:id", validateToken, async (req, res) => {
  const postId = req.params.id;
  await Posts.destroy({ where: { id: postId, user: req.user.username } });
  res.json({ status: true });
});
router.post("/", validateToken, async (req, res) => {
  const post = req.body;
  post.user = req.user.username;
  post.UserId = req.user.id;
  await Posts.create(post);
  res.json(post);
});
router.put("/title", validateToken, async (req, res) => {
  const { newTitle, id } = req.body;
  await Posts.update({ title: newTitle }, { where: { id: id } });
  res.json(newTitle);
});
router.put("/body", validateToken, async (req, res) => {
  const { newBody, id } = req.body;
  await Posts.update({ description: newBody }, { where: { id: id } });
  res.json(newBody);
});

module.exports = router;
