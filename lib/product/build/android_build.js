const os = require('os');
var projectPath = require('./../common').rootPath();
var child = require('child_process');
var exec = child.exec;
class AndroidBuild {
    build(callback) {
        var mPlatform = os.platform();
        if (mPlatform == "darwin") {
            exec("cd " + projectPath + "/android/pluginDemo && chmod +x gradlew && ./gradlew buildBundle", function(err, stdout, stderr) {
                if (!err) {
                    console.log('打包成功');
                } else {
                    console.log('打包失败');
                }
                callback(!err);
            });
        } else {
            //TODO windows
            exec(" ", function(err, stdout, stderr) {
                if (!err) {
                    //
                } else {
                    console.log('打包失败');
                }
                callback(!err);
            });
        }
    }
}

function buildWithAtom(callback){
	new AndroidBuild().build(callback);
}
exports.buildWithAtom = buildWithAtom;
