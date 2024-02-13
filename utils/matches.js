"use strict";
exports.__esModule = true;
exports.getOpponentId = exports.addMatch = exports.getMatchWord = exports.deleteMatchFor = exports.deleteMatch = exports.getMatchById = void 0;
var matches = new Map();
function getMatchById(uuid1) {
    var keys = Array.from(matches.keys());
    var matchingKey = keys.find(function (key) { return key.includes(uuid1); });
    if (matchingKey) {
        return matches.get(matchingKey);
    }
    return undefined;
}
exports.getMatchById = getMatchById;
function deleteMatch(match) {
    matches.forEach(function (val, key) {
        if (val === match) {
            matches["delete"](key);
            return;
        }
    });
}
exports.deleteMatch = deleteMatch;
function deleteMatchFor(clientId) {
    var match = getMatchById(clientId);
    matches.forEach(function (val, key) {
        if (val === match) {
            matches["delete"](key);
            return;
        }
    });
}
exports.deleteMatchFor = deleteMatchFor;
function getMatchWord(clientId) {
    var match = getMatchById(clientId);
    return match.word;
}
exports.getMatchWord = getMatchWord;
function addMatch(initiatorId, playerId, word) {
    matches.set([initiatorId, playerId], {
        word: word,
        initiator: initiatorId,
        player: playerId
    });
}
exports.addMatch = addMatch;
function getOpponentId(clientId) {
    var matchObj = getMatchById(clientId);
    if (matchObj !== undefined) {
        return matchObj.initiator === clientId
            ? matchObj.player
            : matchObj.initiator;
    }
    return null;
}
exports.getOpponentId = getOpponentId;
