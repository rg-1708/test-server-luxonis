// Message types
export enum MessageType {
  INITIATION = 0,
  AUTH_REQUEST = 1,
  AUTH_SUCCESS = 2,
  AUTH_FAILURE = 3,
  MESSAGE = 4,
  CLIENT_LIST_REQUEST = 5,
  CLIENT_LIST_RESPONSE = 6,
  MATCH_REQUEST = 7,
  MATCH_RESPONSE = 8,
  MATCH_CLIENT_ID = 9,
  MATCH_CLIENT_ID_RESPONSE = 10,
  MATCH_CLIENT_ID_ERROR = 11,
  MATCH_CLIENT_ID_NOTIFICATION = 12,
  MATCH_HINT = 13,
  MATCH_ATTEMPT = 14,
  MATCH_ATTEMPT_WRONG = 15,
  MATCH_ATTEMPT_RIGHT = 16,
  MATCH_GIVE_UP = 17,
  MATCH_END_PREMATURE = 18,
  MATCH_END_GUESSED = 19,
  RESET = 21,
}

export type MatchKey = [uuid, uuid];
export type Match = {
  word: string;
  initiator: uuid;
  player: uuid;
};

export type uuid = `${string}-${string}-${string}-${string}-${string}`;
