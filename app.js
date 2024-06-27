const express = require("express");
const app = express();
var cors = require("cors");

app.use(cors({ exposedHeaders: "Authorization" }));

require("./startup/googleOAuth")();
require("./startup/publicFolders")(app);
require("./startup/dotenv")();
require("./startup/routes")(app);
require("./startup/db")();

const port = process.env.PORT || 8000;

app.use((_, res) => {
  res.send({
    message: "Not found!",
  });
});

// listener;
app.listen(port, () => {
  console.info(`listening on port ${port}`);
});
