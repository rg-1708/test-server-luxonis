import * as net from "net";
import { uuid } from "../types";
import { addClient } from "./users";

const serverPassword = "1234";

export const auth = (socket: net.Socket, payload: Buffer): uuid => {
  const password = payload.toString();
  if (password === serverPassword) {
    const clientID = addClient(socket);
    console.log(clientID);
    return clientID;
  } else {
    return null;
  }
};
