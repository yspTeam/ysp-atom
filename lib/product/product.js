'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';

export default class Product {

    shell_tool: null;

    constructor(serializedState) {
        this.ysp_server = new YSPServer();
        this.ysp_server.run();

        shell_tool = new YSPMacSimulator();
        shell_tool.setYSPServer(this.ysp_server);
    }

    run() {
        shell_tool.init();
    }

    build() {
        this.ysp_server.generateZip(function() {
            shell_tool.pluginBuilded();
        });
    }

    stop() {
        this.ysp_server.stop();
    }
}
