import * as net from "net";

import { MessageType } from "../types";
import { encoder } from "./encoding";

export function sendMessage(
  socket: net.Socket,
  type: MessageType,
  message: string
): void {
  const payload = Buffer.from(message);
  const encodedMessage = encoder(type, payload);
  socket.write(encodedMessage);
}
