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

exports.rootPath = rootPath;
exports.getLocalIp = getLocalIp;
exports.sleep = sleep;
