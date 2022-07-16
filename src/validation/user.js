const Joi = require('joi');

const signupValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    role: Joi.required(),
    password: Joi.string().required().min(6),
  });
  return schema.validate(data);
};

const signinValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  });
  return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.signinValidation = signinValidation;
