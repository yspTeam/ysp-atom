'use babel';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';

export default class Product {

    simulator_tool: null;
    toolbar: null;
    ysp_server: null;

    constructor(serializedState) {
        //server 初始化&启动
        ysp_server = new YSPServer();
        ysp_server.run();

        //模拟器 初始化
        simulator_tool = new YSPMacSimulator();
        simulator_tool.setYSPServer(ysp_server.getHttpServer());

        //工具栏 初始化
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
            switch (action) {
                case "run":
                    var isSimulator = data;
                    if (isSimulator) {
                        simulator_tool.init();
                    } else {
                        ysp_server.reloadDevice();
                    }
                    break;
                case "select_simulator":
                    simulator_tool.setSimulatorDevice(data);
                    break;
                default:

            }
        });
        simulator_tool.allSimulator(function(nameArr, deviceArr) {
            toolbar.setDeviceArr(nameArr, deviceArr);
        });
    }

    toggle() {
        toolbar.show();
    }

    run() {
        simulator_tool.init();
    }

    stop() {
        ysp_server.stop();
    }
}
