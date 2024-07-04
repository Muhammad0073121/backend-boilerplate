const Joi = require("joi");

function validateCustomer(user) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
  });
  return schema.validate(user);
}

module.exports.validateCustomer = validateCustomer;
