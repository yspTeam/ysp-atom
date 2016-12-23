'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';

export default class Product {

    shell_tool: null;
    toolbar: null;
    ysp_server: null;

    constructor(serializedState) {
              //server 初始化&启动
        ysp_server = new YSPServer();
        ysp_server.run();

//模拟器 初始化
        shell_tool = new YSPMacSimulator();
        shell_tool.setYSPServer(ysp_server.getHttpServer());

//工具栏 初始化
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
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
