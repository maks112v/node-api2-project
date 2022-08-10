const express = require('express');
const router = express.Router();
const Post = require('./posts-model.js');

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

router.post('/', async (req, res) => {
  try {
    if (!req.body.title || !req.body.contents) {
      return res.status(400).json({
        message: 'Please provide title and contents for the post',
      });
    }

    const { id } = await Post.insert(req.body);
    const post = await Post.findById(id);

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({
      message: 'There was an error while saving the post to the database',
    });
  }
});

router.put('/:id', async (req, res) => {
  const ogPost = await Post.findById(req.params.id);

  if (!ogPost) {
    return res.status(404).json({
      message: 'The post with the specified ID does not exist',
    });
  }

  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      message: 'Please provide title and contents for the post',
    });
  }

  try {
    await Post.update(req.params.id, req.body);
    const post = await Post.findById(req.params.id);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: 'The post information could not be modified',
    });
  }
});

router.delete('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: 'The post with the specified ID does not exist',
    });
  }

  try {
    await Post.remove(req.params.id);

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({
      message: 'The post could not be removed',
    });
  }
});

router.get('/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: 'The post with the specified ID does not exist',
    });
  }

  try {
    const comments = await Post.findPostComments(req.params.id);

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({
      message: 'The comments information could not be retrieved',
    });
  }
});

module.exports = router;
