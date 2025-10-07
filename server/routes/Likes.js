const express = require("express");
const router = express.Router();
const { Likes, Posts } = require("../models");
const { validateToken } = require("../midleware/authMiddleware");

router.post("/", validateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.body.postId;
  console.log(req.body.postId);
  const likeItem = await Likes.findOne({
    where: { UserId: userId, PostId: postId },
  });

  if (likeItem) {
    await Likes.destroy({ where: { UserId: userId, PostId: postId } });
    const postList = await Posts.findAll({ include: [Likes] });
    res.json({ like: false, postList: postList });
  } else {
    await Likes.create({ UserId: userId, PostId: postId });
    const postList = await Posts.findAll({ include: [Likes] });
    res.json({ like: true, postList: postList });
  }
});

module.exports = router;
