const { stripeAccount } = require("../models/stripeAccounts");
const { validateCustomer } = require("../validations/stripeValidations");

const stripe = require("stripe")(
  "sk_test_51PWI8xBc8tIUXGH5bgPQ5uKrQE27F4nWiNyRrXNo9XJ6ZqvJAON7lfxeP7NXXbDPPRDAlZosRgUMrTq4uqvpOt7X00N5fU95Ag"
);

const auth = async (req, res) => {
  try {
    const code = req.query?.code;
    const userId = req.query?.state;

    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });

    let stripeUser = await stripeAccount.findOne({ user: userId });
    if (!stripeUser) {
      stripeUser = new stripeAccount({
        user: userId,
        token: response,
      });
      await stripeUser.save();
    }
    res.redirect("http://localhost:3000");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server Error");
  }
};

const createCustomer = async (req, res) => {
  try {
    const error = validateCustomer(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const userId = req.user._id;
    const { name, email } = req.body;
    let stripeUser = await stripeAccount.findOne({ user: userId });
    if (!stripeUser) {
      return res.status(400).send("User not found");
    }
    const customer = await stripe.customers.create(
      {
        name: name,
        email: email,
      },
      {
        stripeAccount: stripeUser.token.stripe_user_id,
      }
    );
    res.send(customer);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server Error");
  }
};

const stripeController = {
  auth,
  createCustomer,
};

module.exports = stripeController;
