'use babel';
import YSPServer from './server/ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';
// import YSPStatuBar from './toolbar/ysp_statu_bar';
import YSPSettingView from './toolbar/view/ysp_setting_view';

export default class Product {

    simulator_tool: null;
    toolbar: null;
    // statubar:null;
    ysp_server: null;

    constructor(serializedState) {
        productSelf = this;

        //server 初始化&启动
        ysp_server = new YSPServer();
        ysp_server.run(function(port) {
            toolbar.setProjectInfo(require('./common').getLocalIp(), port);
        });
        ysp_server.setStatuBeat(function(stau, msg, clientarr) {
            toolbar.setShining(stau, msg, clientarr);
        });
        window.ysp_socket_server = ysp_server.getSocketServer();
        window.ysp_server = ysp_server;

        //模拟器 初始化
        simulator_tool = new YSPMacSimulator();
        simulator_tool.setYSPServer(ysp_server.getHttpServer());

        //工具栏 初始化
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
            switch (action) {
                case "run":
                    handleRun(data);
                    break;
                case "select_simulator":
                    simulator_tool.setSimulatorDevice(data);
                    break;
                case "setting":
                    new YSPSettingView().show();
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
        handleRun(true);
    }

    stop() {
        window.ysp_server.stop();
    }

    static staticBuild(callback){
              build(callback);
   }
}

function handleRun(isSimulator) {
    build(function() {
        if (isSimulator) {
            simulator_tool.init();
        } else {
            window.ysp_socket_server.sendReload2Device();
        }
    });
}

function build(callback) {
    var path = require('path');
    var inputPath = path.normalize(require('./common').rootPath() + '/ios');
    var outputPath = path.normalize(require('./common').rootPath() + '/build/cache/ios');
    var zipInputPath = path.normalize(require('./common').rootPath() + '/build/cache');
    var zipOutputPath = path.normalize(require('./common').rootPath() + '/build/output/ios');
    try {
        require('./build/ios_build').buildWithAtom(inputPath,outputPath);
        require('./common.js').createiOSZip(zipInputPath,zipOutputPath,function(zipPath) {
            callback();
        });
    } catch (e) {
        console.error('build失败，原因：' + e);
    } finally {
    }
}
