const { googleOAuthUser } = require("../models/googleOAuth");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const auth = async (req, res) => {
  try {
    const query = req.query;
    const authUrl = global.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });
    res.redirect(authUrl + "&&state=" + query.userId);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server Error");
  }
};

const callback = async (req, res) => {
  try {
    const userId = req.query.state;
    const code = req.query.code; // Authorization code from Google
    const { tokens } = await global.oAuth2Client.getToken(code); // Exchange code for tokens
    global.oAuth2Client.setCredentials(tokens);
    // Fetch user's email using the access token
    const oauth2 = google.oauth2({ auth: global.oAuth2Client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    const userEmail = data.email;
    // Store tokens and email in the database
    let user = await googleOAuthUser.findById(userId);
    if (!user) {
      user = new googleOAuthUser({
        user: userId,
        email: userEmail,
        token: tokens,
      });
    } else {
      user.googleToken = tokens;
    }
    await user.save();
    res.redirect(process.env.redirect_uri);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const gOAuthController = {
  auth,
  callback,
};

module.exports = gOAuthController;
