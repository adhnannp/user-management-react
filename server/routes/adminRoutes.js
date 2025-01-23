const express = require("express");
const router = express.Router();
const { adminLogin, getUsers, addUser, editUser, deleteUser } = require("../controllers/adminController");
const authenticateAdmin = require("../middlewares/adminAuth");

router.post("/login", adminLogin);
router.get("/get-users", authenticateAdmin,getUsers);
router.post("/add-user",authenticateAdmin,addUser);
router.post('/edit-user/:id', authenticateAdmin,editUser);
router.delete('/delete-user/:id',authenticateAdmin,deleteUser);

module.exports = router;
