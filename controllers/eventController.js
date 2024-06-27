const { googleOAuthUser } = require("../models/googleOAuth");
const { google } = require("googleapis");
const { User } = require("../models/users");

const getAllEvents = async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.userAuth._id,
    });
    if (!user) {
      return res.status(400).send("User not found!");
    }
    const userEmail = user.email; // Replace with actual user email
    const googleUser = await googleOAuthUser.findOne({ email: userEmail });
    if (!googleUser)
      return res.status(404).send("Google Account is not synced!");

    global.oAuth2Client.setCredentials(user.googleToken);

    let currentTimeUnix = Date.now();

    if (user.googleToken.expiry_date < currentTimeUnix) {
      const newToken = await global.oAuth2Client.refreshAccessToken();
      await googleOAuthUser.findOneAndUpdate(
        { email: userEmail },
        { token: newToken.credentials }
      );
      global.oAuth2Client.setCredentials(newToken.credentials);
    } else {
      global.oAuth2Client.setCredentials(user.googleToken);
    }

    const calendar = google.calendar({
      version: "v3",
      auth: global.oAuth2Client,
    });

    const eventStartTime = new Date("2024-06-01");

    calendar.events.list(
      {
        calendarId: "primary",
        timeMin: eventStartTime.toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: "startTime",
      },
      (err, response) => {
        if (err)
          return res.status(500).send("The API returned an error: " + err);
        const events = response.data.items;

        // Filter events to only include those created by the user
        const userEvents = events.filter(
          (event) => event.creator.email === userEmail
        );

        res.json(userEvents);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(400).send("Server Error");
  }
};

const addEvent = async (req, res) => {
  try {
    const userEmail = req.body.email; // Get the user email from the request body
    const user = await googleOAuthUser.findOne({ email: userEmail });

    if (!user) return res.status(404).send("User not found");

    global.oAuth2Client.setCredentials(user.googleToken);

    let currentTimeUnix = Date.now();

    if (user.googleToken.expiry_date < currentTimeUnix) {
      const newToken = await global.oAuth2Client.refreshAccessToken();
      await googleOAuthUser.findOneAndUpdate(
        { email: userEmail },
        { token: newToken.credentials }
      );
      global.oAuth2Client.setCredentials(newToken.credentials);
    } else {
      global.oAuth2Client.setCredentials(user.googleToken);
    }

    const calendar = google.calendar({
      version: "v3",
      auth: global.oAuth2Client,
    });

    const eventStartTime = new Date();
    eventStartTime.setDate(eventStartTime.getDay() + 2);

    const eventEndTime = new Date();
    eventEndTime.setDate(eventEndTime.getDay() + 2);
    eventEndTime.setMinutes(eventEndTime.getMinutes() + 45);

    const event = {
      summary: req.body.summary,
      location: req.body.location,
      description: req.body.description,
      start: {
        dateTime: eventStartTime,
        timeZone: "CET",
      },
      end: {
        dateTime: eventEndTime,
        timeZone: "CET",
      },
      attendees: req.body.attendees,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };

    const eventResponse = await calendar.events.insert({
      auth: global.oAuth2Client,
      calendarId: "primary", // Specifies the primary calendar
      resource: event,
    });

    res.status(200).send(eventResponse.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const eventController = {
  addEvent,
  getAllEvents,
};

module.exports = eventController;
