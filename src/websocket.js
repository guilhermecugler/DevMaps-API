const socketio = require("socket.io");
const passStringAsArray = require("./utils/passStringAsArray");
const calculateDistance = require("./utils/calculateDistance");

let io;
const connections = [];

exports.setupWebSocket = server => {
  io = socketio(server);

  io.on("connection", socket => {
    const { latitude, longitude, techs } = socket.handshake.query;

    connections.push({
      id: socket.id,
      coordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude)
      },
      techs: passStringAsArray(techs)
    });
  });
};

exports.findConnections = (coordinates, techs) => {
  return connections.filter(connection => {
    return (
      calculateDistance(coordinates, connections.coordinates) < 10 &&
      connections.techs.some(item => techs.includes(item))
    );
  });
};

exports.sendMessage = (to, message, data) => {
  to.forEach(connection => {
    io.to(connection.id).emit(message, data);
  });
};
