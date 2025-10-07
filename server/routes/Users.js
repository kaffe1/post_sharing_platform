const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Users } = require("../models");
const { sign } = require("jsonwebtoken");
const { validateToken } = require("../midleware/authMiddleware");
// router.get("/", async (req, res) => {
//   const postList = await Posts.findAll();
//   res.json(postList);
// });

//registration
router.post("/", async (req, res) => {
  const { username, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    Users.create({
      username: username,
      password: hash,
    });
    res.json("success!!!!");
  });
});

//login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username: username } });
  if (!user) {
    res.json({ error: "User doesn't exist !" });
  }
  bcrypt.compare(password, user.password).then((match) => {
    if (!match) {
      res.json({ error: "Password isn't correct !" });
    } else {
      const accessToken = sign(
        { username: user.username, id: user.id },
        "important_secret"
      );
      res.json(accessToken);
    }
  });
});
//check if it's logged in
router.get("/check", validateToken, (req, res) => {
  res.json(req.user);
});
router.get("/byUserId/:id", async (req, res) => {
  const id = req.params.id;
  const user = await Users.findByPk(id);
  res.json(user.username);
});

router.put("/changePassword", validateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Users.findOne({ where: { username: req.user.username } });
  if (!user) {
    return res.json({ error: "User doesn't exist !" });
  }
  bcrypt.compare(oldPassword, user.password).then((match) => {
    if (!match) {
      return res.json({ error: "wrong password !!" });
    }
    bcrypt.hash(newPassword, 10).then((hash) => {
      Users.update(
        { password: hash },
        { where: { username: req.user.username } }
      );
      return res.json("success!!!!");
    });
  });
});

module.exports = router;
