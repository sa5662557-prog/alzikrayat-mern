const express = require('express');
const commentController = require('../controllers/commentController');
const { validate, commentSchema, idSchema } = require('../middleware/validation');

const router = express.Router();

router.get('/api/photos/:id/comments', validate(idSchema, 'params'), commentController.getByPhoto);
router.post('/api/photos/:id/comments', validate(idSchema, 'params'), validate(commentSchema), commentController.create);

module.exports = router;
