'use babel';

import {
    Directory
} from 'atom';

function rootPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
        var rootPath = pathList[0];
        return rootPath;
    }

    return __dirname;
}

function iosConfigPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
        var rootPath = pathList[0];
        var path = require('path');
        return path.join(rootPath, 'ios/config.json');
    }

    return null;
}

function pluginOpenID() {
    try {
        var path = iosConfigPath();
        if (path == null) {
            return "";
        }
        var txt = require('fs').readFileSync(path)
        var obj = JSON.parse(txt);
        var openid = obj.openId;
        return openId;
    } catch (e) {
        console.error('获取openid错误');
        return "";
    } finally {

    }
}

function pluginVersion() {
    try {
        var path = iosConfigPath();
        if (path == null) {
            return "";
        }
        var txt = require('fs').readFileSync(path);
        var obj = JSON.parse(txt);
        var ver = obj.version;
        return ver;
    } catch (e) {
        console.error('获取version错误');
        return "";
    } finally {

    }
}

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function getLocalIp() {
    var os = require('os');
    var IPv4;
    for (var i = 0; i < os.networkInterfaces().en0.length; i++) {
        if (os.networkInterfaces().en0[i].family == 'IPv4') {
            IPv4 = os.networkInterfaces().en0[i].address;
        }
    }
    return IPv4;
}

var zipSavePath = "";
function getCreateiOSZipPath(outputPath) {
    var path = require('path');
    if (outputPath==null) {
              outputPath = path.normalize(rootPath() + '/build/output/ios');
   }

    var projectPath = rootPath();
    var tmp = projectPath.split(path.sep);
    var projectName = tmp[tmp.length - 1];

    mkdirs(outputPath, 0777, function(p){});

    return path.normalize(outputPath + '/' + projectName + '.zip');
}

function createiOSZip(inputPath,outputPath,callback) {
    var JSZip = require("jszip");
    var fs = require('fs');
    var path = require('path');
    var zip = new JSZip();

    addFile2Zip(zip, inputPath)

    zipSavePath = getCreateiOSZipPath(outputPath);
    zip.generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true
        })
        .pipe(fs.createWriteStream(zipSavePath))
        .on('finish', function() {
            console.info("generate zip : " + zipSavePath);
            callback(zipSavePath);
        });
}

function addFile2Zip(zip, root) {
    var fs = require('fs');
    var path = require('path');

    var files = fs.readdirSync(root);
    files.forEach(function(file) {
        var filePath = path.normalize(root + '/' + file);
        if (fs.statSync(filePath).isFile()) {
            if (path.extname(filePath) != '.zip') {
                zip.file(file, fs.readFileSync(filePath));
            }
        }
        if (fs.statSync(filePath).isDirectory()) {
            if (file != "build") {
                addFile2Zip(zip.folder(file), filePath);
            }
        }
    });
}

function mkdirs(dirpath, mode, callback) {
          var path = require('path');
          var fs = require('fs');
    fs.exists(dirpath, function(exists) {
        if(exists) {
                callback(dirpath);
        } else {
                mkdirs(path.dirname(dirpath), mode, function(){
                    var fs = require('fs');
                        fs.mkdir(dirpath, mode, callback);
                });
        }
    });
};

exports.rootPath = rootPath;
exports.getLocalIp = getLocalIp;
exports.pluginVersion = pluginVersion;
exports.pluginOpenID = pluginOpenID;
exports.getCreateiOSZipPath = getCreateiOSZipPath;
exports.createiOSZip = createiOSZip;
exports.sleep = sleep;
