'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './ysp_toolbar';

export default class Product {

    shell_tool: null;
        toolbar: null;

    constructor(serializedState) {
this.toolbar = new YSPToolBar();

        this.ysp_server = new YSPServer();
        this.ysp_server.run();

        shell_tool = new YSPMacSimulator();
        shell_tool.setYSPServer(this.ysp_server);
    }

    run() {
        shell_tool.init();
    }

    stop() {
        this.ysp_server.stop();
    }
}
