"use strict";
exports.__esModule = true;
exports.isValidMatchRequest = exports.isUUID = void 0;
var uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
// Function to check if a string matches the UUID pattern
function isUUID(str) {
    return uuidPattern.test(str);
}
exports.isUUID = isUUID;
function isValidMatchRequest(str) {
    return str.match(/^([\w-]+) (\w+)$/);
}
exports.isValidMatchRequest = isValidMatchRequest;
