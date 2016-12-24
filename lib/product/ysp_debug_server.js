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

    run() {
    httpServer.run(function(port){
              socketServer.run(port);
   });
    }

    stop() {
    httpServer.stop();
    }

    getHttpServer(){
              return httpServer;
   }
}
