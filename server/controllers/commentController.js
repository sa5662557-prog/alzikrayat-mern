const Comment = require('../models/Comment');
const Photo = require('../models/Photo');
const User = require('../models/User');

const getByPhoto = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const comments = await Comment.find({ photoId: photo._id })
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: 1 });

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(401).json({ error: 'Please login to add a comment' });
    }

    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const comment = new Comment({
      photoId: photo._id,
      userId: user._id,
      comment: req.body.comment
    });
    await comment.save();
    await comment.populate('userId', 'firstName lastName');

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

module.exports = { getByPhoto, create };
