import { Match, MatchKey, uuid } from "../types";

const matches = new Map<MatchKey, Match>();

export function getMatchById(uuid1: uuid): Match | undefined {
  const keys: MatchKey[] = Array.from(matches.keys());
  const matchingKey = keys.find((key) => key.includes(uuid1));
  if (matchingKey) {
    return matches.get(matchingKey);
  }
  return undefined;
}

export function deleteMatch(match: Match): void {
  matches.forEach((val, key) => {
    if (val === match) {
      matches.delete(key);
      return;
    }
  });
}
export function deleteMatchFor(clientId: uuid): void {
  const match = getMatchById(clientId);
  matches.forEach((val, key) => {
    if (val === match) {
      matches.delete(key);
      return;
    }
  });
}
export function getMatchWord(clientId: uuid): string {
  const match = getMatchById(clientId);
  return match.word;
}

export function addMatch(
  initiatorId: uuid,
  playerId: uuid,
  word: string
): void {
  matches.set([initiatorId, playerId], {
    word,
    initiator: initiatorId,
    player: playerId,
  });
}

export function getOpponentId(clientId: uuid) {
  const matchObj = getMatchById(clientId);
  if (matchObj !== undefined) {
    return matchObj.initiator === clientId
      ? matchObj.player
      : matchObj.initiator;
  }
  return null;
}
