'use babel';

var child = require('child_process');
var exec = child.exec;
var seq = '+';
export default class YSPMacSimulator {

    projectName: null;
    ip: nul;
    self: null;

    constructor(serializedState) {
        self = this;
        this.simulator_device = 'iPhone SE'

        var path = require('path');
        var projectPath = require('./common').rootPath();
        var tmp = projectPath.split(path.sep);
        this.projectName = tmp[tmp.length - 1];
        console.info('ysp openid : ' + this.projectName);

        ip = require('./common').getLocalIp();
        console.info('ysp ip : ' + ip);
    }

    setSimulatorDevice(device) {
        this.simulator_device = device;
    }

    setYSPServer(server) {
        this.ysp_http_server = server;
    }

    init() {
        //启动模拟器  open -a Simulator  也可以
        exec("xcrun instruments -w '" + this.simulator_device + "'", function(err, stdout, stderr) {
            //   exec("xcrun simctl uninstall booted com.yy.yymobile.developer");
            exec('xcrun simctl openurl booted yymobile://', function(err, stdout, stderr) {
                if (err) {
                    var path = require('path');
                    var yyappPath = path.join(__dirname, 'yy/YYMobile.app');
                    exec("xcrun simctl install booted " + yyappPath, function(err, stdout, stderr) {
                        if (!err) {
                            exec("xcrun simctl launch booted com.yy.yymobile.developer");
                            require('./common').sleep(7000);
                            self.SimulatorParamsInit();
                        } else {
                            console.log('安装手Y失败');
                        }
                    });
                } else {
                    exec("xcrun simctl terminate booted com.yy.yymobile.developer");
                    exec("xcrun simctl launch booted com.yy.yymobile.developer");
                    require('./common').sleep(3000);
                    self.SimulatorParamsInit();
                }
            })
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

    SimulatorParamsInit() {
        if (this.ysp_http_server == null || this.ysp_http_server.isRunning() == false) {
            console.log('ysp server未启动，请重启Atom');
            return;
        }

        var port = this.ysp_http_server.getServerPort();
        this.yySend({
            'openid': this.projectName,
            'ip': ip,
            'port': port,
            'command_d_auto': 1
        });
    }

    allSimulator(callback) {
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
            callback(nameArr, deviceArr);
        });
    }
}
