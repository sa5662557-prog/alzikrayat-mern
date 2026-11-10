const Joi = require('joi');
const fs = require('fs');

const objectId = Joi.string().hex().length(24).messages({
  'string.hex': '{#label} is invalid',
  'string.length': '{#label} is invalid'
});

const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required().label('First name'),
  lastName: Joi.string().trim().max(50).required().label('Last name'),
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().min(8).max(100).required().label('Password'),
  location: Joi.string().trim().max(100).allow('').label('Location'),
  description: Joi.string().trim().max(500).allow('').label('Description'),
  occupation: Joi.string().trim().max(100).allow('').label('Occupation')
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().label('Email'),
  password: Joi.string().required().label('Password')
});

const photoSchema = Joi.object({
  userId: objectId.required().label('User id'),
  title: Joi.string().trim().max(150).required().label('Title'),
  description: Joi.string().trim().max(1000).allow('').label('Description')
});

const commentSchema = Joi.object({
  userId: objectId.required().label('User id'),
  comment: Joi.string().trim().max(1000).required().label('Comment')
});

const ownerSchema = Joi.object({
  userId: objectId.required().label('User id')
});

const idSchema = Joi.object({
  id: objectId.required().label('Photo id')
});

const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property] || {}, {
    errors: { wrap: { label: false } }
  });

  if (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({ error: error.details[0].message });
  }

  if (property === 'body') {
    req.body = value;
  }

  next();
};

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  photoSchema,
  commentSchema,
  ownerSchema,
  idSchema
};
