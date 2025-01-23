const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/dbConfig");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use('/uploads', express.static('uploads'));

connectDB();

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
