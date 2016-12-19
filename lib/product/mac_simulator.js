'use babel';

import YSPServer from './ysp_debug_server';

var child = require('child_process');
var exec = child.exec;
var seq = '+';
export default class YSPMacSimulator {

    projectName: null;
    ip : nul;
    self: null;

    constructor(serializedState) {
        self = this;

        var path = require('path');
        var projectPath = require('./common').rootPath();
        var tmp = projectPath.split(path.sep);
        this.projectName = tmp[tmp.length - 1];
        console.log('ysp openid : ' + this.projectName);

        ip = getLocalIp();
        console.log('ysp ip : ' + ip);
    }

    setYSPServer(server) {
        this.ysp_server = server;
    }

    init() {
        //启动模拟器  open -a Simulator  也可以
        exec("xcrun instruments -w 'iPhone SE'", function(err, stdout, stderr) {
            //   exec("xcrun simctl uninstall booted com.yy.yymobile.developer");
            exec('xcrun simctl openurl booted yymobile://', function(err, stdout, stderr) {
                if (err) {
                    var path = require('path');
                    var yyappPath = path.join(__dirname, 'YYMobile.app');
                    exec("xcrun simctl install booted " + yyappPath, function(err, stdout, stderr) {
                        if (!err) {
                            //         exec("xcrun simctl launch booted com.yy.yymobile.developer");
                            self.yySend({
                                'command_d': '1'
                            });
                        } else {
                            console.log('安装手Y失败');
                        }
                    });
                } else {
                    self.yySend({
                        'command_d': '1'
                    });
                    // exec("xcrun simctl launch booted com.yy.yymobile.developer");
                }
            })
        });
    }

    yySend(paramDic) {
        var paramStr = '';
        //增加project参数
        paramStr += 'openid=' + this.projectName + seq;
        paramStr += 'ip=' + ip + seq;
        var port = this.ysp_server.getServerPort();
        if (port > 0) {
            paramStr += 'port=' + port + seq;
        }
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

    yyCommand_D() {
        this.yySend({
            'command_d': '1'
        });
    }

    pluginBuilded() {
        this.yySend({
            'command_d': '1'
        });
    }

    allSimulator() {
        exec("xcrun simctl list");
    }
}

function getLocalIp(){
          var os = require('os');
var IPv4;
for(var i=0;i<os.networkInterfaces().en0.length;i++){
    if(os.networkInterfaces().en0[i].family=='IPv4'){
        IPv4=os.networkInterfaces().en0[i].address;
    }
}
return IPv4;
}
