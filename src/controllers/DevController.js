const axios = require("axios");
const Dev = require("../models/Dev");
const passStringAsArray = require("../utils/passStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `http://api.github.com/users/${github_username}`
      );

      const { name, avatar_url, bio } = response.data;
      name === null ? (name = github_username) : "";

      const techArray = passStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techArray,
        location
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techArray
      );

      sendMessage(sendSocketMessageTo, "newDev", dev);
    }

    return res.json(dev);
  }
};
