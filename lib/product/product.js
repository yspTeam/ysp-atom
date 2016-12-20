'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';

export default class Product {

    shell_tool: null;
    toolbar: null;

    constructor(serializedState) {
        this.toolbar = new YSPToolBar();
        this.toolbar.show();
        this.toolbar.setCallback(function(action) {
           switch (action) {
                     case "run":
                         shell_tool.init();
                               break;
                     default:

           }
        });

        this.ysp_server = new YSPServer();
        this.ysp_server.run();

        shell_tool = new YSPMacSimulator();
        shell_tool.setYSPServer(this.ysp_server);
    }

    toggle() {
        this.toolbar.show();
    }

    run() {
        shell_tool.init();
    }

    stop() {
        this.ysp_server.stop();
    }
}
