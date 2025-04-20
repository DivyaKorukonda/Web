// routes/posts.js
const express = require('express');
const router = express.Router();
const Post = require('../models/Post'); // Ensure the correct path

// Example route to create a post
router.post('/create', async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.body.image, // You can use a file upload middleware to handle this
      user: req.body.user,
    });

    await newPost.save();
    res.status(201).send(newPost);
  } catch (err) {
    res.status(400).send({ message: 'Error creating post', error: err });
  }
});

// Example route to get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user'); // Populate user info if needed
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).send({ message: 'Error fetching posts', error: err });
  }
});

module.exports = router;
