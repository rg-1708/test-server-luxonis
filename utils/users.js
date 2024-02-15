"use strict";
exports.__esModule = true;
exports.getClientsExcept = exports.getClientId = exports.getClientSocketById = exports.deleteClient = exports.addClient = void 0;
var crypto = require("crypto");
var clients = new Map();
function addClient(socket) {
    var clientId = crypto.randomUUID();
    clients.set(clientId, socket);
    return clientId;
}
exports.addClient = addClient;
function deleteClient(clientId) {
    clients["delete"](clientId);
}
exports.deleteClient = deleteClient;
function getClientSocketById(clientId) {
    return clients.get(clientId);
}
exports.getClientSocketById = getClientSocketById;
function getClientId(socket) {
    console.log(socket);
    if (socket === null || socket === undefined) {
        return null;
    }
    var entries = Array.from(clients.entries());
    for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
        var _a = entries_1[_i], clientId = _a[0], clientSocket = _a[1];
        if (clientSocket === socket) {
            return clientId;
        }
    }
    return null;
}
exports.getClientId = getClientId;
function getClientsExcept(clientId) {
    var clientSocket = clients.get(clientId);
    if (clientSocket) {
        var clientList = Array.from(clients.keys()).filter(function (id) { return id !== clientId; });
        return clientList;
    }
    return null;
}
exports.getClientsExcept = getClientsExcept;
