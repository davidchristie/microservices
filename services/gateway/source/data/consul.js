const consul = require("consul");

module.exports = consul({
  host: "platform-consul"
});
