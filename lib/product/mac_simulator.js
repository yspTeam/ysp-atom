'use babel';

import ProjectConfig from './../project-config.js';

var child = require('child_process');
var exec = child.exec;
var seq = '+';
export default class YSPMacSimulator {

    projectName: null;
    ip: nul;
    self: null;

    constructor(serializedState) {
        self = this;

        var path = require('path');
        var projectPath = require('./common').rootPath();
        var tmp = projectPath.split(path.sep);
        this.projectName = tmp[tmp.length - 1];

        ip = require('./common').getLocalIp();
    }

    runiOSSimulator(device) {
        //启动模拟器  open -a Simulator  也可以
        exec("xcrun instruments -w '" + device + "'", function(err, stdout, stderr) {
            //   exec("xcrun simctl uninstall booted com.yy.yymobile.developer");
            self.runIOS();
        });
    }

    stopIosApp() {
        var iosID = ProjectConfig.iosBundleId();
        exec("xcrun simctl terminate booted " + iosID);
    }

    runIOS() {
        var scheme = ProjectConfig.iosScheme();
        var iosID = ProjectConfig.iosBundleId();
        var iosAppFilename = ProjectConfig.iosAppFileName();
        exec('xcrun simctl openurl booted ' + scheme, function(err, stdout, stderr) {
            console.log('asdljaslkdaskl 2');
            if (err) {
                if (err.toString().indexOf('No devices are booted.') >= 0) {
                    //没启动设备，不管，让用户自己启动
                    return;
                }
                var path = require('path');
                var yyappPath = path.join(__dirname, 'download/' + iosAppFilename);
                exec("xcrun simctl install booted " + yyappPath, function(err, stdout, stderr) {
                    if (!err) {
                        exec("xcrun simctl launch booted " + iosID);
                        require('./common').sleep(7000);
                        self.SendOpenUrlParams2Simulator();
                    } else {
                        alert('安装iOS宿主失败，请重新下载');
                    }
                });
            } else {
                exec("xcrun simctl launch booted " + iosID);
                require('./common').sleep(3000);
                self.SendOpenUrlParams2Simulator();
            }
        });
    }

    yySend(paramDic) {
        var paramStr = '';
        for (var k in paramDic) {
            paramStr += k + '=' + paramDic[k];
            paramStr += seq;
        }
        if (paramStr.length > 0) {
            paramStr = paramStr.substring(0, paramStr.length - seq.length);
        }
        console.log('parmas:' + paramStr);
        exec("xcrun simctl openurl booted yymobile://ysp?" + paramStr);
    }

    SendOpenUrlParams2Simulator() {
        // if (this.ysp_http_server == null || this.ysp_http_server.isRunning() == false) {
        //     console.log('ysp server未启动，请重启Atom');
        //     return;
        // }

        var port = window.ysp_port;
        if (port == null) {
            port = 0;
        }
        this.yySend({
            'openid': this.projectName,
            'ver': require('./common').pluginVersion(),
            'ip': ip,
            'port': port,
            'command_d_auto': 1
        });
    }

    iPhoneSimulators(callback) {
        if (window.iosSimulatorNames != null) {
            callback(window.iosSimulatorNames, window.iosSimulatorDevices);
            return;
        }
        exec("xcrun instruments -w 'iPhone'", function(err, stdout, stderr) {
            var arr = stderr.split('\n');
            var nameArr = new Array();
            var deviceArr = new Array();
            var index = 0;
            for (var s in arr) {
                if (arr[s].indexOf('iPhone') == 0) {
                    var name = arr[s].substring(0, arr[s].indexOf('['));
                    var device = arr[s].substring(arr[s].indexOf('[') + 1, arr[s].indexOf(']'));
                    if (name.indexOf('Apple Watch') == -1) {
                        nameArr[index] = name;
                        deviceArr[index] = device;
                        index++;
                    }
                }
            }
            window.iosSimulatorNames = nameArr;
            window.iosSimulatorDevices = deviceArr;
            callback(nameArr, deviceArr);
        });
    }

    AndroidSimulators(callback) {
        callback(new Array(), new Array());
    }
}
