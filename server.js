require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const cors = require('cors');

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(cors());

// Serve static files (HTML, CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public'))); // Static files served from the 'public' folder

// MongoDB connection using Mongoose
const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected to Atlas successfully!");
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
  });

// Order Schema definition
const orderSchema = new mongoose.Schema({
  username: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

// POST route to place an order
app.post('/api/orders', async (req, res) => {
  const { username, item, quantity } = req.body;

  console.log("✅ New Order Received:", req.body);

  // Validate the request body
  if (!username || !item || !quantity) {
    return res.status(400).json({ message: "All fields (username, item, quantity) are required!" });
  }

  // Check if the SECRET_KEY is correct (optional validation logic)
  if (process.env.SECRET_KEY !== "mySecret123") {
    return res.status(400).json({ message: "Invalid secret key." });
  }

  try {
    // Save the new order to MongoDB Atlas
    const newOrder = new Order({
      username,
      item,
      quantity
    });

    await newOrder.save();

    console.log("✅ Order saved to MongoDB Atlas");

    // Respond with success message
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (err) {
    console.log("❌ Error saving order to MongoDB:", err);
    res.status(500).json({ message: "Error placing order." });
  }
});

// Start the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
