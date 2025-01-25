const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig');
const { loginUser, registerUser, uploadProfilePicture, getUser } = require("../controllers/userController");
const authenticateUser = require("../middlewares/auth");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post('/upload-profile-picture/:id', upload.single('image'), uploadProfilePicture);
router.get('/data',authenticateUser,getUser);

module.exports = router;
