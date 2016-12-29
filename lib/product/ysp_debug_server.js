'use babel';
import YSPHttpServer from './ysp_http_server';
import YSPSocketServer from './ysp_socket_server';

export default class YSPServer {

    socketServer: null;
    httpServer: null;

    constructor(serializedState) {
        httpServer = new YSPHttpServer();
        socketServer = new YSPSocketServer();
    }

    run(callback) {
        httpServer.run(function(ip,port) {
            socketServer.run(port);
            callback(ip,port);
        });
    }

    runDevice() {
        socketServer.sendCommand_D();
    }

    stop() {
        httpServer.stop();
    }

    getHttpServer() {
        return httpServer;
    }
}
