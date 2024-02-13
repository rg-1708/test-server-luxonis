"use strict";
exports.__esModule = true;
exports.getClientsExcept = exports.getClientSocketById = exports.deleteClient = exports.addClient = void 0;
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
function getClientsExcept(clientId) {
    var clientSocket = clients.get(clientId);
    if (clientSocket) {
        var clientList = Array.from(clients.keys()).filter(function (id) { return id !== clientId; });
        return clientList;
    }
    return null;
}
exports.getClientsExcept = getClientsExcept;
