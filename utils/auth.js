"use strict";
exports.__esModule = true;
exports.auth = void 0;
var users_1 = require("./users");
var serverPassword = "1234";
var auth = function (socket, payload) {
    var password = payload.toString();
    if (password === serverPassword) {
        var clientID = (0, users_1.addClient)(socket);
        console.log(clientID);
        return clientID;
    }
    else {
        return null;
    }
};
exports.auth = auth;
