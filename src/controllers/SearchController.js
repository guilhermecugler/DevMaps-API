const Dev = require("../models/Dev");
const passStringAsArray = require("../utils/passStringAsArray");

module.exports = {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;

    const techsArray = passStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsArray
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });

    return res.json({ devs });
  }
};
