"use strict";
exports.__esModule = true;
var net = require("net");
var types_1 = require("./types");
var encoding_1 = require("./utils/encoding");
var messaging_1 = require("./utils/messaging");
var validation_1 = require("./utils/validation");
var auth_1 = require("./utils/auth");
var users_1 = require("./utils/users");
var matches_1 = require("./utils/matches");
var server = net.createServer(function (socket) {
    var authenticated = false;
    var clientID = null;
    console.log("Client connected.");
    (0, messaging_1.sendMessage)(socket, types_1.MessageType.INITIATION, "Welcome to the server!");
    socket.on("data", function (data) {
        var _a = (0, encoding_1.decoder)(data), type = _a.type, payload = _a.payload;
        if (!authenticated) {
            if (type === types_1.MessageType.AUTH_REQUEST) {
                clientID = (0, auth_1.auth)(socket, payload);
                if (clientID != null) {
                    (0, messaging_1.sendMessage)(socket, types_1.MessageType.AUTH_SUCCESS, "Welcome ".concat(clientID, "!"));
                    authenticated = true;
                }
                else {
                    (0, messaging_1.sendMessage)(socket, types_1.MessageType.AUTH_FAILURE, "Error: Invalid Password.");
                }
            }
        }
        else {
            handleClientMessages(clientID, type, payload, socket);
        }
    });
    socket.on("end", function () {
        console.log("Client disconnected.");
        (0, users_1.deleteClient)(clientID);
    });
    socket.on("error", function (err) {
        console.error("Socket error:", err);
        clientID;
        (0, users_1.deleteClient)(clientID);
    });
});
var PORT = 3000;
server.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
});
function handleClientMessages(clientId, type, payload, socket) {
    var opponentSocket;
    var opponentId = (0, matches_1.getOpponentId)(clientId);
    if (opponentId !== null) {
        opponentSocket = (0, users_1.getClientSocketById)(opponentId);
    }
    switch (type) {
        case types_1.MessageType.CLIENT_LIST_REQUEST:
            (0, messaging_1.sendMessage)((0, users_1.getClientSocketById)(clientId), types_1.MessageType.CLIENT_LIST_RESPONSE, (0, users_1.getClientsExcept)(clientId).join(","));
            break;
        case types_1.MessageType.MATCH_REQUEST:
            (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_RESPONSE, "Please send the ID of the desired opponent, and a word");
            break;
        case 21:
            (0, messaging_1.sendMessage)(socket, types_1.MessageType.AUTH_SUCCESS, "Welcome ".concat(clientId));
            break;
        case types_1.MessageType.MATCH_CLIENT_ID:
            var matchRequestPayload = (0, validation_1.isValidMatchRequest)(payload.toString());
            if (matchRequestPayload) {
                var playerId = matchRequestPayload[1], word = matchRequestPayload[2];
                if (!(0, validation_1.isUUID)(playerId)) {
                    (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_CLIENT_ID_ERROR, "Invalid message format");
                }
                opponentId = playerId;
                opponentSocket = (0, users_1.getClientSocketById)(playerId);
                (0, matches_1.addMatch)(clientId, opponentId, word);
                (0, messaging_1.sendMessage)((0, users_1.getClientSocketById)(opponentId), types_1.MessageType.MATCH_CLIENT_ID_NOTIFICATION, "You are starting a match with ".concat(clientId));
                (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_CLIENT_ID_RESPONSE, "You are starting a match with ".concat(opponentId, ", the word is ").concat(word));
            }
            else {
                (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_CLIENT_ID_ERROR, "Invalid message format");
            }
            break;
        case types_1.MessageType.MATCH_ATTEMPT:
            if (payload.toString() === (0, matches_1.getMatchWord)(clientId)) {
                (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_ATTEMPT_RIGHT, "Congratulations, you guessed the word!");
                (0, messaging_1.sendMessage)((0, users_1.getClientSocketById)((0, matches_1.getOpponentId)(clientId)), 19, "Your word has been guessed!");
                (0, matches_1.deleteMatchFor)(clientId);
            }
            else {
                (0, messaging_1.sendMessage)(socket, types_1.MessageType.MATCH_ATTEMPT_WRONG, "Guess again!");
            }
            break;
        case 17:
            (0, messaging_1.sendMessage)(socket, types_1.MessageType.AUTH_SUCCESS, "Welcome ".concat(clientId));
            (0, messaging_1.sendMessage)(opponentSocket, types_1.MessageType.AUTH_SUCCESS, "Your opponent gave up, Welcome again ".concat(opponentId));
            break;
        case types_1.MessageType.MATCH_HINT:
            (0, messaging_1.sendMessage)(opponentSocket, types_1.MessageType.MATCH_HINT, payload.toString());
            break;
    }
}
