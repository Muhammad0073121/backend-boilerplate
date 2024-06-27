const _ = require("lodash");
const bcrypt = require("bcrypt");
const {
  validateChangePassword,
  validateEditFunc,
} = require("../validations/userValidations");
const { User } = require("../models/users");

const changePassword = async (req, res) => {
  try {
    const { error } = validateChangePassword(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({
      _id: req.userAuth._id,
    });
    if (!user) return res.status(201).send("User not found!");
    const { currentPassword, newPassword } = req.body;
    let validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) return res.status(400).send("Invalid Current Password");
    const salt = await bcrypt.genSalt(10);
    let newPassHash = await bcrypt.hash(newPassword, salt);
    user = await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          password: newPassHash,
        },
      },
      { new: true }
    );
    return res.status(200).send("Password updated successfully!");
  } catch (error) {
    return res.status(400).send("Server Error");
  }
};

const edit = async (req, res) => {
  try {
    const { error } = validateEditFunc(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({
      _id: req.userAuth._id,
    });

    if (!user) {
      return res.status(400).send("User not found!");
    }
    const { firstname, lastname } = req.body;
    user = await User.findByIdAndUpdate(
      user.id,
      {
        $set: {
          firstname: firstname,
          lastname: lastname,
        },
      },
      { new: true }
    );

    res.send(_.pick(user, ["_id", "firstname", "lastname", "email"]));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const userDetail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    res
      .status(200)
      .send(_.pick(user, ["_id", "firstname", "lastname", "email"]));
  } catch (error) {
    res.status(400).send("Unable to get User Details: " + error);
  }
};

const userController = {
  changePassword,
  edit,
  userDetail,
};

module.exports = userController;
