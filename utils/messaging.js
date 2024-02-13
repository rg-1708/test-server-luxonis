"use strict";
exports.__esModule = true;
exports.sendMessage = void 0;
var encoding_1 = require("./encoding");
function sendMessage(socket, type, message) {
    var payload = Buffer.from(message);
    var encodedMessage = (0, encoding_1.encoder)(type, payload);
    socket.write(encodedMessage);
}
exports.sendMessage = sendMessage;
