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

        //模拟器 初始化 (预缓存)
        simulator_tool = new YSPMacSimulator();
        simulator_tool.iPhoneSimulators((arr1, arr2) => {});
        simulator_tool.AndroidSimulators((arr1, arr2) => {});

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
                window.ysp_socket_server.sendReload2Device("iOS");
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

var runProgress = 0.99;

function funProgress() {
    runProgress = runProgress * 0.99;
    require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', 1.0 - runProgress);
}

function doProgress(success) {
    runProgress = 0.99;
    if (!success) {
        if (window.product_timer == null) {
            window.product_timer = window.setInterval(funProgress, 100);
        }
        require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', 0);
    } else {
        require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', 1);
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
        console.log('android build start');
        doProgress(false);
        buildAndroid(function(err) {
            if (err == null) {
                console.log('android build success');
                window.ysp_socket_server.sendReload2Device("Android");
            } else {
                console.log('android build fail' + err);
            }
            doProgress(true);
        });
    }
    // if run iOS
    if (ProjectConfig.isRuniOS()) {
        require('./common').emitter().emit('ysp_toolbar_setProgress', true, 'running', 1);
        console.log('ios build start');
        buildIOS(function() {
            console.log('ios build success');
            window.ysp_socket_server.sendReload2Phone();
            simulator_tool.runIOS();
            require('./common').emitter().emit('ysp_toolbar_setProgress', false, 'running', 0);
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
        alert('buildIOS fail，info：' + e);
    } finally {}
}

function buildAndroid(callback) {
    try {
        require('./build/android_build').buildWithAtom(function() {
            callback();
        });
    } catch (e) {
        alert('buildAndroid fail，info：' + e);
    } finally {}
}
