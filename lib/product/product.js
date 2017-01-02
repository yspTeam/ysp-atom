'use babel';
import File from './../file/file';
import YSPServer from './server/ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';
import YSPHttpDownloader from './http_downloader';
// import YSPStatuBar from './toolbar/ysp_statu_bar';
import YSPSettingView from './toolbar/view/ysp_setting_view';

export default class Product {

    pfile: null;
    downloader: null;
    simulator_tool: null;
    toolbar: null;
    // statubar:null;
    ysp_server: null;

    constructor(serializedState) {
        productSelf = this;
        pfile = new File();
        //初始化下载类
        downloader = new YSPHttpDownloader();

        //server 初始化&启动
        ysp_server = new YSPServer();
        ysp_server.run(function(port) {
            toolbar.setProjectInfo(require('./common').getLocalIp(), port);
        });
        ysp_server.setStatuBeat(function(stau, msg, clientarr) {
            toolbar.setShining(stau, msg, clientarr);
        });
        window.ysp_socket_server = ysp_server.getSocketServer();

        //模拟器 初始化
        simulator_tool = new YSPMacSimulator();
        simulator_tool.setYSPServer(ysp_server.getHttpServer());

        //工具栏 初始化
        // statubar = new YSPStatuBar();
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
            switch (action) {
                case "run":
                    pfile.refreshConfig();
                    var isSimulator = data;
                    if (isSimulator) {
                        simulator_tool.init();
                    } else {
                    //     ysp_server.runDevice();
                    window.ysp_socket_server.sendCommand_D();
                    }
                    break;
                case "select_simulator":
                    simulator_tool.setSimulatorDevice(data);
                    break;
                case "setting":
                    new YSPSettingView().show(function(action, data, complate) {
                        switch (action) {
                            case "begin_download":
                                var url = data;
                                downloadZip(url, complate);
                                new YSPSettingView().hid();
                                break;
                            default:

                        }
                    });
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
        pfile.refreshConfig();
        simulator_tool.init();
    }

    stop() {
        ysp_server.stop();
    }

}

function downloadZip(url, callback) {
    toolbar.showProgress(true, 'downloading', 0);
    downloader.download(url, function(progress, complate) {
        toolbar.showProgress(!complate, 'downloading', progress);
        if (complate) {
            callback();
        }
    });
}
