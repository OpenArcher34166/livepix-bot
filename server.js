require("dotenv").config();
const path = require("path");

const client = require(path.join(__dirname, "src", "bot", "DiscordClient.js"));

require("./src/events/ready")(client);
require("./src/events/messageCreate")(client);

client.login(process.env.DISCORD_TOKEN);