const Joi = require("joi");

function validateRegister(user) {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(50).required().label("First Name"),
    lastname: Joi.string().min(1).max(50).required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  });
  return schema.validate(user);
}

function validateLogin(user) {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().min(5).max(255).required().label("Password"),
  });
  return schema.validate(user);
}

module.exports.validateRegister = validateRegister;
module.exports.validateLogin = validateLogin;
