import * as net from "net";

import { MessageType, uuid } from "./types";
import { decoder } from "./utils/encoding";
import { sendMessage } from "./utils/messaging";
import { isUUID, isValidMatchRequest } from "./utils/validation";
import { auth } from "./utils/auth";
import {
  deleteClient,
  getClientSocketById,
  getClientsExcept,
} from "./utils/users";
import {
  addMatch,
  deleteMatchFor,
  getMatchWord,
  getOpponentId,
} from "./utils/matches";

const server = net.createServer((socket) => {
  let authenticated = false;
  let clientID = null;
  console.log("Client connected.");
  sendMessage(socket, MessageType.INITIATION, "Welcome to the server!");

  socket.on("data", (data) => {
    const { type, payload } = decoder(data);
    if (!authenticated) {
      if (type === MessageType.AUTH_REQUEST) {
        clientID = auth(socket, payload);
        if (clientID != null) {
          sendMessage(socket, MessageType.AUTH_SUCCESS, `Welcome ${clientID}!`);
          authenticated = true;
        } else {
          sendMessage(
            socket,
            MessageType.AUTH_FAILURE,
            "Error: Invalid Password."
          );
        }
      }
    } else {
      handleClientMessages(clientID, type, payload, socket);
    }
  });

  socket.on("end", () => {
    console.log("Client disconnected.");
    deleteClient(clientID);
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
    deleteClient(clientID);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

function handleClientMessages(
  clientId: uuid,
  type: MessageType,
  payload: Buffer,
  socket: net.Socket
): void {
  let opponentSocket;
  let opponentId = getOpponentId(clientId);
  if (opponentId !== null) {
    opponentSocket = getClientSocketById(opponentId);
  }

  switch (type) {
    case MessageType.CLIENT_LIST_REQUEST:
      sendMessage(
        getClientSocketById(clientId),
        MessageType.CLIENT_LIST_RESPONSE,
        getClientsExcept(clientId).join(",")
      );
      break;
    case MessageType.MATCH_REQUEST:
      sendMessage(
        socket,
        MessageType.MATCH_RESPONSE,
        "Please send the ID of the desired opponent, and a word"
      );
      break;
    case MessageType.MATCH_CLIENT_ID:
      const matchRequestPayload = isValidMatchRequest(payload.toString());
      if (matchRequestPayload) {
        const [, playerId, word] = matchRequestPayload;
        if (!isUUID(playerId)) {
          sendMessage(
            socket,
            MessageType.MATCH_CLIENT_ID_ERROR,
            "Invalid message format"
          );
        }

        opponentId = playerId as uuid;
        opponentSocket = getClientSocketById(playerId as uuid);
        addMatch(clientId, opponentId, word);

        sendMessage(
          getClientSocketById(opponentId),
          MessageType.MATCH_CLIENT_ID_NOTIFICATION,
          `You are starting a match with ${clientId}`
        );
        sendMessage(
          socket,
          MessageType.MATCH_CLIENT_ID_RESPONSE,
          `You are starting a match with ${opponentId}, the word is ${word}`
        );
      } else {
        sendMessage(
          socket,
          MessageType.MATCH_CLIENT_ID_ERROR,
          "Invalid message format"
        );
      }
      break;
    case MessageType.MATCH_ATTEMPT:
      if (payload.toString() === getMatchWord(clientId)) {
        sendMessage(
          socket,
          MessageType.MATCH_ATTEMPT_RIGHT,
          "Congratulations, you guessed the word!"
        );
        sendMessage(
          getClientSocketById(getOpponentId(clientId)),
          MessageType.MESSAGE,
          "Your word has been guessed!"
        );
        deleteMatchFor(clientId);
      } else {
        sendMessage(socket, MessageType.MATCH_ATTEMPT_WRONG, "Guess again!");
      }
      break;
    case MessageType.MATCH_HINT:
      sendMessage(opponentSocket, MessageType.MATCH_HINT, payload.toString());
      break;
  }
}
