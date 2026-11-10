const fs = require('fs');
const path = require('path');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const User = require('../models/User');

const uploadsPath = path.join(__dirname, '..', 'uploads');

const removeFile = (fileName) => {
  fs.unlink(path.join(uploadsPath, fileName), (error) => {
    if (error) {
      console.error('Could not delete file:', fileName);
    }
  });
};

const getAll = async (req, res, next) => {
  try {
    const photos = await Photo.find()
      .populate('userId', 'firstName lastName')
      .sort({ dateTime: -1 });

    res.status(200).json(photos);
  } catch (error) {
    next(error);
  }
};

const getOne = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('userId', 'firstName lastName');

    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    res.status(200).json(photo);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please choose a photo to upload' });
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      removeFile(req.file.filename);
      return res.status(401).json({ error: 'Please login to upload photos' });
    }

    const photo = new Photo({
      userId: user._id,
      fileName: req.file.filename,
      title: req.body.title,
      description: req.body.description
    });
    await photo.save();
    await photo.populate('userId', 'firstName lastName');

    res.status(201).json(photo);
  } catch (error) {
    if (req.file) {
      removeFile(req.file.filename);
    }
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    if (photo.userId.toString() !== req.body.userId) {
      return res.status(403).json({ error: 'You can only delete your own photos' });
    }

    await Comment.deleteMany({ photoId: photo._id });
    await Photo.findByIdAndDelete(photo._id);
    removeFile(photo.fileName);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getOne, create, remove };
