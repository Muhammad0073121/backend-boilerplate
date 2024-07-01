const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  validateLogin,
  validateRegister,
} = require("../validations/authValidations");
const { User } = require("../models/users");

const login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const formData = req.body;
    const user = await User.findOne({ email: formData.email });
    if (!user) return res.status(400).send("User Doesn't Exists");
    let validPassword = await bcrypt.compare(formData.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Credentials");
    await user.removeAuthToken(user._id);
    const accessToken = user.generateAuthToken();
    await user.saveAuthToken(accessToken, user._id);
    const obj = {
      token: accessToken,
      user: _.pick(user, ["_id", "firstname", "lastname", "email"]),
    };
    return res.send(obj);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const register = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const formData = req.body;
    const user = await User.findOne({ email: formData.email });
    if (user) {
      return res.status(400).send("User already registered");
    }
    const newUser = new User({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
    });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(formData.password, salt);
    await newUser.save();
    const accessToken = newUser.generateAuthToken();
    newUser.saveAuthToken(accessToken, newUser._id);
    const userObj = {
      token: accessToken,
      user: _.pick(newUser, ["_id", "firstname", "lastname", "email"]),
    };
    return res.send(userObj);
  } catch (error) {
    return res.status(400).send(error);
  }
};

const authController = {
  login,
  register,
};

module.exports = authController;
