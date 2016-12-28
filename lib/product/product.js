'use babel';
import File from './../file/file';
import YSPServer from './ysp_debug_server';
import YSPMacSimulator from './mac_simulator';
import YSPToolBar from './toolbar/ysp_toolbar';
import YSPHttpDownloader from './http_downloader';
import YSPStatuBar from './toolbar/ysp_statu_bar';

export default class Product {

    pfile: null;
    downloader: null;
    simulator_tool: null;
    toolbar: null;
    statubar:null;
    ysp_server: null;

    constructor(serializedState) {
        pfile = new File();
        //初始化下载类
        downloader = new YSPHttpDownloader();

        //server 初始化&启动
        ysp_server = new YSPServer();
        ysp_server.run();

        //模拟器 初始化
        simulator_tool = new YSPMacSimulator();
        simulator_tool.setYSPServer(ysp_server.getHttpServer());

        //工具栏 初始化
        statubar = new YSPStatuBar();
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
            switch (action) {
                case "run":
                    // downloadZip('http://damoreport.bs2cdn.yy.com/C394A491-D8B1-4394-8C1C-DAA9B7661080.zip');
                    pfile.refreshConfig();
                    var isSimulator = data;
                    if (isSimulator) {
                        simulator_tool.init();
                    } else {
                        ysp_server.runDevice();
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
        pfile.refreshConfig();
        simulator_tool.init();
    }

    stop() {
        ysp_server.stop();
    }

}

function downloadZip(url) {
    downloader.download(url, function(progress, complate) {
              console.log(complate);
                  statubar.showProgress(!complate,'downloading',progress);
    });
}
