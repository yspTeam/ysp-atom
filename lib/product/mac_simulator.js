'use babel';

var child = require('child_process');
var exec = child.exec;
export default class YSPMacSimulator {


    constructor(serializedState) {

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
                            exec("xcrun simctl openurl booted yymobile://ysp");
                        } else {
                            console.log('安装手Y失败');
                        }
                    });
                } else {
                    exec("xcrun simctl openurl booted yymobile://ysp");
                    // exec("xcrun simctl launch booted com.yy.yymobile.developer");
                }
            })
        });
    }

    yyCommand_R() {
        console.log('a3');
        exec("xcrun simctl openurl booted yymobile://ysp?command_d");
    }

    yyOpenID(){
    var path = require('path');
    var projectPath = rootPath();
        var tmp = projectPath.split(path.sep);
        var projectName = tmp[tmp.length - 1];
          exec("xcrun simctl openurl booted yymobile://ysp?openid="+projectName);
          console.log('ysp send openid='+projectName);
   }

    yyCommand_D() {
              this.yySend('command_d');
    }
        pluginBuilded() {
        var path = require('path');
            var projectPath = rootPath();
            var tmp = projectPath.split(path.sep);
            var projectName = tmp[tmp.length - 1];
                  this.yySend("command_d&openid="+projectName);
        }

    allSimulator() {
        exec("xcrun simctl list");
    }
}

function rootPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
        var rootPath = pathList[0];
        return rootPath;
    }

    return null;
}
