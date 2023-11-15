const express = require("express");

const { getUsers, getUser, createUser, editUserById, deleteUserById } = require("../services/user.service");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await getUsers();

  return res.send(users);
});

router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await getUser.byId(parseInt(userId));

    return res.send(user);
  } catch (error) {
    return res.status(400).json({ errors: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUserData = req.body;

    if (!(newUserData.name && newUserData.email && newUserData.password)) {
      return res.status(400).json({ errors: "Some fields are missing" });
    }

    const user = await createUser(newUserData);

    return res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    return res.status(400).json({ errors: error.message });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const userData = req.body;

  if (!(userData.name && userData.email && userData.password)) {
    return res.status(400).json({ errors: "Some fields are missing" });
  }

  const user = await editUserById(parseInt(userId), userData);

  return res.json({
    message: "User updated",
  });
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    await deleteUserById(parseInt(userId));

    return res.json({ message: "User deleted" });
  } catch (error) {
    return res.status(400).json({ errors: error.message });
  }
});

module.exports = router;
