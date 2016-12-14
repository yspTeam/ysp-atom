'use babel';
import YSPServer from './ysp_debug_server/ysp_debug_server';

export default class Product {

    constructor(serializedState) {
        this.ysp_server = new YSPServer();
        this.ysp_server.run();
    }

    run() {
        console.log('run proj!');
    }
    build() {
        console.log('build proj!');
    }
    stop() {
        this.ysp_server.stop();
    }
}
