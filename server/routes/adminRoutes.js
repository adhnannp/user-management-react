const express = require("express");
const router = express.Router();
const { adminLogin, getUsers, addUser, editUser, deleteUser } = require("../controllers/adminController");

router.post("/login", adminLogin);
router.get("/get-users",getUsers);
router.post("/add-user",addUser);
router.post('/edit-user/:id', editUser);
router.delete('/delete-user/:id',deleteUser);

module.exports = router;
