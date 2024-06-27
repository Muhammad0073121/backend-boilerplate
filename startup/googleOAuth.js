const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const CREDENTIALS_PATH = path.join(__dirname, "../config/credentials.json");

module.exports = function () {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.error("Error loading client secret file:", err);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;
    global.oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
  });
};
