const { stripeAccount } = require("../models/stripeAccounts");

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

const stripeController = {
  auth,
};

module.exports = stripeController;
