import * as net from "net";
import { uuid } from "../types";
import * as crypto from "crypto";

const clients = new Map<uuid, net.Socket>();

export function addClient(socket: net.Socket): uuid {
  const clientId = crypto.randomUUID() as uuid;
  clients.set(clientId as uuid, socket);
  return clientId;
}

export function deleteClient(clientId: uuid): void {
  clients.delete(clientId);
}

export function getClientSocketById(clientId: uuid): net.Socket {
  return clients.get(clientId);
}

export function getClientsExcept(clientId: uuid): uuid[] {
  const clientSocket = clients.get(clientId);
  if (clientSocket) {
    const clientList = Array.from(clients.keys()).filter(
      (id) => id !== clientId
    );
    return clientList;
  }
  return null;
}
