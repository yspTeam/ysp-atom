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

exports.rootPath = rootPath;
exports.sleep = sleep;
