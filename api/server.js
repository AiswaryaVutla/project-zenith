require("dotenv").config();

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const client = new MongoClient(process.env.MONGO_URI);

let postsCollection;

// Connect to MongoDB
async function startServer() {
  try {
    await client.connect();
    const db = client.db("zenithDB");
    postsCollection = db.collection("posts");

    console.log("✅ Connected to MongoDB Atlas");

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
}

startServer();


// ==========================
// API ROUTES
// ==========================

// GET all posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await postsCollection
      .find()
      .sort({ createdAt: -1 })
      .toArray();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


// CREATE post
app.post("/posts", async (req, res) => {
  try {
    const { title, category, content } = req.body;

    const newPost = {
      title,
      category,
      content,
      createdAt: new Date(),
    };

    const result = await postsCollection.insertOne(newPost);
    res.status(201).json(result);

  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
});


// DELETE post
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await postsCollection.deleteOne({ _id: new ObjectId(id) });

    res.json({ message: "Post deleted" });

  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});


// ========================
// Update Post (PATCH)
// ========================
app.patch("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content } = req.body;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          category,
          content,
          updatedAt: new Date()
        }
      }
    );

    res.json({ message: "Post updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update post" });
  }
});
module.exports = app;
