import { Socket } from "socket.io";
import { MessageController } from "./controllers/message-controller";

export function initSocketController(io: Socket) {
 
    initMessageController(io);

}

function initMessageController(socket: Socket) {
  new MessageController().listenSocket(socket);
}
