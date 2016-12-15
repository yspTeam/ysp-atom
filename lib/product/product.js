'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';

export default class Product {

    constructor(serializedState) {
        this.ysp_server = new YSPServer();
           this.ysp_server.run();

            this.shell_tool = new YSPMacSimulator();
    }

    run() {
this.shell_tool.init();
    }
    build() {
        this.ysp_server.generateZip();
    }
    stop() {
        this.ysp_server.stop();
    }
}
