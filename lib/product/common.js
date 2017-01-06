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

var zipRootPath = __dirname;
var zipOutputPath = __dirname;
var zipSavePath = "";

function createZipFolder() {
    var fs = require('fs');
    var path = require('path');

    zipRootPath = path.normalize(rootPath() + '/build');
    try {
        fs.accessSync(zipRootPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipRootPath, 0777);
    }

    zipRootPath = path.normalize(rootPath() + '/build/generated/');
    try {
        fs.accessSync(zipRootPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipRootPath, 0777);
    }

    zipOutputPath = path.normalize(rootPath() + '/build/output');
    try {
        fs.accessSync(zipOutputPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipOutputPath, 0777);
    }
}

function getCreateZipPath() {
    var path = require('path');

    var projectPath = rootPath();
    var tmp = projectPath.split(path.sep);
    var projectName = tmp[tmp.length - 1];

    return path.normalize(zipOutputPath + '/' + projectName + '.zip');
}

function createZip(callback) {
    var JSZip = require("jszip");
    var fs = require('fs');
    var path = require('path');
    var zip = new JSZip();

    createZipFolder();

    addFile2Zip(zip, zipRootPath)

    zipSavePath = getCreateZipPath();
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

exports.rootPath = rootPath;
exports.getLocalIp = getLocalIp;
exports.pluginVersion = pluginVersion;
exports.pluginOpenID = pluginOpenID;
exports.getCreateZipPath = getCreateZipPath;
exports.createZip = createZip;
exports.sleep = sleep;
