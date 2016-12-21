'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';

export default class Product {

    shell_tool: null;
    toolbar: null;
    ysp_server:null;

    constructor(serializedState) {
        ysp_server = new YSPServer();
        ysp_server.run();

        shell_tool = new YSPMacSimulator();
        shell_tool.setYSPServer(ysp_server);

        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action,data) {
            switch (action) {
                case "run":
                    shell_tool.init();
                    break;
                        case "select_simulator":
shell_tool.setSimulatorDevice(data);
                            break;
                default:

            }
        });
        shell_tool.allSimulator(function(nameArr, deviceArr) {
            toolbar.setDeviceArr(nameArr, deviceArr);
        });
        var path = require('path');
                        var projectPath = require('./common.js').rootPath();
                        var tmp = projectPath.split(path.sep);
                        var projectName = tmp[tmp.length - 1];
                        var projectArr = new Array();
                        projectArr[0] = projectName;
        toolbar.setProject(projectArr);
    }

    toggle() {
        toolbar.show();
    }

    run() {
        shell_tool.init();
    }

    stop() {
        ysp_server.stop();
    }
}
