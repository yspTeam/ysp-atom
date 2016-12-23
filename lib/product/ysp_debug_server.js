'use babel';
import YSPHttpServer from './ysp_http_server';

export default class YSPServer {

          socketServer: null;
    httpServer: null;

    constructor(serializedState) {
        httpServer = new YSPHttpServer();
    }

    run() {
    httpServer.run();
    }

    stop() {
    httpServer.stop();
    }

    getHttpServer(){
              return httpServer;
   }
}
