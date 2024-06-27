const Joi = require("joi");

function validateChangePassword(user) {
  const schema = Joi.object({
    currentPassword: Joi.string()
      .min(5)
      .max(255)
      .required()
      .label("Current Password"),
    newPassword: Joi.string().min(5).max(255).required().label("New Password"),
  });
  return schema.validate(user);
}

function validateEditFunc(user) {
  const schema = Joi.object({
    firstname: Joi.string().min(1).max(50).required().label("First Name"),
    lastname: Joi.string().min(1).max(50).required().label("Last Name"),
  });
  return schema.validate(user);
}

module.exports.validateUpdatePassword = validateChangePassword;
module.exports.validateEdit = validateEditFunc;
