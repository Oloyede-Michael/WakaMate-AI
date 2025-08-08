const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173", // Frontend dev server
    credentials: true, // Allow cookies if needed
  })
);

app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Root route for base URL
app.get("/", (req, res) => {
  res.send("✅🚀 Welcome to Wakamate's backend API services.API services are running on this port for production");
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api", productRoutes);

// Server
const PORT = process.env.PORT || 1050;
app.listen(PORT, () => {
  console.log(`Server running ons http://localhost:${PORT}`);
});

//mongodb+srv://officialswiftfund:<db_password>@wakamateaidb.bxmcyla.mongodb.net/ (compass connection)

//atlas in the future (mongodb+srv://officialswiftfund:NextGenAlpha@wakamateaidb.bxmcyla.mongodb.net/?retryWrites=true&w=majority&appName=WakamateAiDB)