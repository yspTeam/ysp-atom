'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';

export default class Product {

    constructor(serializedState) {
        this.ysp_server = new YSPServer();
        this.ysp_server.run();

        var events = require("events");
        var emitter = new events.EventEmitter();
        emitter.addListener("ysp_zip_generated", function() {
                  console.log('a3');
            this.shell_tool.yyCommand_R();
        });

        this.shell_tool = new YSPMacSimulator();
    }

    run() {
        this.shell_tool.init();
    }

    build() {
        this.shell_tool.yyOpenID();
        this.ysp_server.generateZip();
        this.shell_tool.yyCommand_R();
    }

    stop() {
        this.ysp_server.stop();
    }
}
