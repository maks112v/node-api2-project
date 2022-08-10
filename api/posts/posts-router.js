const express = require('express');
const router = express.Router();
const Post = require('./posts-model.js');

// implement your posts router here
router.get('/', async (req, res) => {
  const posts = await Post.find();

  return res.status(200).json(posts);
});

router.get('/:id', async (req, res) => {
  const post = await Post.findById(req?.params?.id);

  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({
      message: 'does not exist',
    });
  }
});

module.exports = router;
