'use babel';

var child = require('child_process');
var exec = child.exec;
export default class YSPMacSimulator {


    constructor(serializedState) {

    }

    init() {
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

    refreshYSP() {
        exec("xcrun simctl openurl booted yymobile://ysp?cmmand_d");
    }

    allSimulator() {
        exec("xcrun simctl list");
    }
}
