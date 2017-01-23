'use babel';
import YSPServer from './server/ysp_debug_server';
import YSPToolBar from './toolbar/ysp_toolbar';
import YSPMacSimulator from './mac_simulator';
import YSPSettingView from './toolbar/view/ysp_setting_view';
import ProjectConfig from './../project-config';

export default class Product {

    toolbar: null;
    simulator_tool: null;
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
        simulator_tool.iPhoneSimulators((arr1, arr2) => {});

        //工具栏 初始化
        toolbar = new YSPToolBar();
        toolbar.show();
        toolbar.setCallback(function(action, data) {
            switch (action) {
                case "run":
                    handleRun(data);
                    break;
                case "setting":
                    new YSPSettingView().show();
                    break;
                default:

            }
        });
    }

    toggle() {
        toolbar.show();
    }

    run() {
        handleRun('iOS');
    }

    saveFile() {
        var b = ProjectConfig.quickDebug();
        if (b == true) {
            buildIOS(function() {
                window.ysp_socket_server.sendReload2Device();
            });
        }
    }

    stop() {
        // handleRun(true);
    }

    static staticBuild(callback) {
        buildIOS(callback);
    }
}

var runProgress = 0;

function funProgress() {
    if(runProgress<0.85){
      runProgress = runProgress+0.1;
      require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', runProgress);
  }
}

function doProgress(success) {
    runProgress = 0;
    if (!success) {
        if (window.product_timer == null) {
            window.product_timer = window.setInterval(funProgress, 1500);
        }
        require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', 0);
    } else {
        if (window.product_timer != null) {
            window.clearInterval(window.product_timer);
            window.product_timer = null;
        }
        require('./common').emitter().emit('ysp_toolbar_setProgress', false, 'running', 0);
    }
}

function handleRun(platform) {
    simulator_tool.stopIosApp();
    // if run Android
    if (ProjectConfig.isRunAndroid()) {
      doProgress(false);
      buildAndroid(function(err) {
          if (err == null) {
              console.log('android build 成功');
              window.ysp_socket_server.sendReload2Device();
          } else {
              console.log('android build 失败：' + err);
          }
          doProgress(true);
      });
    }
    // if run iOS
    if (ProjectConfig.isRuniOS()) {
      buildIOS(function() {
         console.log('ios build 成功');
          window.ysp_socket_server.sendReload2Phone();
          simulator_tool.runIOS();
      });
    }
}

function buildIOS(callback) {
    var path = require('path');
    var inputPath = path.normalize(require('./common').rootPath() + '/ios');
    var outputPath = path.normalize(require('./common').rootPath() + '/build/cache/ios');
    var zipInputPath = path.normalize(require('./common').rootPath() + '/build/cache');
    var zipOutputPath = path.normalize(require('./common').rootPath() + '/build/output/ios');
    try {
        require('ysp_ios_build').buildWithAtom(inputPath, outputPath);
        require('./common.js').createiOSZip(zipInputPath, zipOutputPath, function(zipPath) {
            callback();
        });
    } catch (e) {
        alert('buildIOS失败，原因：' + e);
    } finally {}
}

function buildAndroid(callback) {
    try {
        require('./build/android_build').buildWithAtom(function() {
            callback();
        });
    } catch (e) {
        alert('buildAndroid失败，原因：' + e);
    } finally {}
}
