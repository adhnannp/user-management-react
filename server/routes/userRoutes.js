const express = require("express");
const router = express.Router();
const upload = require('../config/multerConfig');
const { loginUser, registerUser, uploadProfilePicture } = require("../controllers/userController");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.post('/upload-profile-picture/:id', upload.single('image'), uploadProfilePicture);

module.exports = router;
