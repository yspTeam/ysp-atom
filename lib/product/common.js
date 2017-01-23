'use babel';
import ProjectConfig from './../project-config.js';
import {
    Directory
} from 'atom';

function emitter() {
    if (window.commonEmitter == null) {
        var events = require('events');
        window.commonEmitter = new events.EventEmitter();
    }
    return window.commonEmitter;
}

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

function osIsWin() {
    if (require('os').platform() == "win32") {
        return true;
    }
    return false;
}

function osIsMac() {
    if (require('os').platform() == "darwin") {
        return true;
    }
    return false;
}

function getLocalIp() {
    var os = require('os');
    var IPv4;

    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }

    return IPv4;
}

function getAndroidZipFilename() {
    var androidPackageName = ProjectConfig.androidPackage();
    var pnArr = androidPackageName.split('.');
    var filename = "lib";
    for (var i in pnArr) {
        filename += pnArr[i] + "_";
    }
    if (pnArr.length > 0) {
        filename = filename.substring(0, filename.length - 1);
    }

    return filename;
}

function getAndroidZipPath() {
    var path = require('path');
    outputPath = path.normalize(rootPath() + '/build/output/android');

    return path.normalize(outputPath + '/' + getAndroidZipFilename() + '.so');
}

var zipSavePath = "";

function getCreateiOSZipFilename() {
    var path = require('path');
    var projectPath = rootPath();
    var tmp = projectPath.split(path.sep);
    var projectName = tmp[tmp.length - 1];

    return projectName;
}

function getCreateiOSZipPath(outputPath) {
    var path = require('path');
    var fs = require('fs');
    var rp = rootPath();
    if (outputPath == null) {
        outputPath = path.normalize(rp + '/build/output/ios');
    }

    // mkdirs(outputPath, 0777, function(p) { });
    var p = path.normalize(rp + '/build');
    try {
        fs.accessSync(p, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(p, 0777);
    }

    p = path.normalize(rp + '/build/output');
    try {
        fs.accessSync(p, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(p, 0777);
    }

    p = path.normalize(rp + '/build/output/ios');
    try {
        fs.accessSync(p, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(p, 0777);
    }

    return path.normalize(outputPath + '/' + getCreateiOSZipFilename() + '.zip');
}

function createiOSZip(inputPath, outputPath, callback) {
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

// function mkdirs(dirpath, mode, callback) {
//     var path = require('path');
//     var fs = require('fs');
//     fs.exists(dirpath, function(exists) {
//         if (exists) {
//             callback(dirpath);
//         } else {
//             mkdirs(path.dirname(dirpath), mode, function() {
//                 var fs = require('fs');
//                 fs.mkdir(dirpath, mode, callback);
//             });
//         }
//     });
// };

exports.rootPath = rootPath;
exports.emitter = emitter;
exports.osIsMac = osIsMac;
exports.osIsWin = osIsWin;
exports.getLocalIp = getLocalIp;
exports.pluginVersion = pluginVersion;
exports.pluginOpenID = pluginOpenID;
exports.getAndroidZipPath = getAndroidZipPath;
exports.getAndroidZipFilename = getAndroidZipFilename;
exports.getCreateiOSZipFilename = getCreateiOSZipFilename;
exports.getCreateiOSZipPath = getCreateiOSZipPath;
exports.createiOSZip = createiOSZip;
exports.sleep = sleep;
