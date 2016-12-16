'use babel';
import {
    Directory
} from 'atom';

var zipRootPath = __dirname;
var thiRuning = false;

export default class YSPServer {

    httpServer: null;

    constructor(serializedState) {
        var path = require('path');
        zipRootPath = path.normalize(rootPath() + '/build');
        console.log('ysp server zip root:' + zipRootPath);
    }

    run() {
        if (thiRuning) {
            console.log('ysp server is running');
            return;
        }
        var url = require('url');
        var http = require('http');
        var fs = require('fs');
        var path = require('path');

        this.httpServer = http.createServer(function(req, res) {
            var action = url.parse(req.url).pathname
            if (action == '/closeServer') {
                this.httpServer.close();
                this.httpServer = null;
            } else if (action == '/log') {
                ysp_debug_log(url.parse(req.url, true).query);
            } else if (action == '/yspZip.zip') {
                //       createZip();

                var projectPath = rootPath();
                var tmp = projectPath.split(path.sep);
                var projectName = tmp[tmp.length - 1];

                //readfile to response
                var filePath = path.normalize(zipRootPath + '/' + projectName + '.zip');
                try {
                    var zipBinary = fs.readFileSync(filePath, "binary");
                    res.writeHead(200, {
                        'Content-Type': 'application/zip'
                    });
                    res.write(zipBinary, "binary");
                    res.end();
                } catch (e) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('not found');
                } finally {

                }
            }
            res.end("action end");
        });
        this.httpServer.listen(2333, () => {
            console.log('ysp server success');
            thiRuning = true;
        });
    }

    stop() {
        this.httpServer.close();
        this.httpServer = null;
    }

    generateZip() {
        createZip();
    }
}

function createZip() {
    var JSZip = require("jszip");
    var fs = require('fs');
    var path = require('path');
    var zip = new JSZip();

    try {
        fs.accessSync(zipRootPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipRootPath, 0777);
    }

    var projectPath = rootPath();
    var tmp = projectPath.split(path.sep);
    var projectName = tmp[tmp.length - 1];

    addFile2Zip(zip, projectPath)

    var zipSavePath = path.normalize(zipRootPath + '/' + projectName + '.zip');
    zip.generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true
        })
        .pipe(fs.createWriteStream(zipSavePath))
        .on('finish', function() {
            console.log("generate zip : " + zipSavePath);
                var events = require("events");
                var emitter = new events.EventEmitter();
            emitter.emit("ysp_zip_generated");
        });

    //lock thread to wait generate zip
    // sleep(1000);
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
            addFile2Zip(zip.folder(file), filePath);
        }
    });
}

function rootPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
        var rootPath = pathList[0];
        return rootPath;
    }

    return null;
}

function ysp_debug_log(query) {
    if (query.t.length > 0) {
        console.log(formatDate(new Date(), "[yyyy-M-d hh:mm:ss:fff]") + ' ' + query.t);
    }
}

function formatDate(date, format) {
    var paddNum = function(num) {
            num += "";
            return num.replace(/^(\d)$/, "0$1");
        }
        //指定格式字符
    var cfg = {
        yyyy: date.getFullYear() //年 : 4位
            ,
        yy: date.getFullYear().toString().substring(2) //年 : 2位
            ,
        M: date.getMonth() + 1 //月 : 如果1位的时候不补0
            ,
        MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
            ,
        d: date.getDate() //日 : 如果1位的时候不补0
            ,
        dd: paddNum(date.getDate()) //日 : 如果1位的时候补0
            ,
        hh: date.getHours() //时
            ,
        mm: date.getMinutes() //分
            ,
        ss: date.getSeconds() //秒
            ,
        fff: date.getMilliseconds() //秒
    }
    format || (format = "yyyy-MM-dd hh:mm:ss");
    return format.replace(/([a-z])(\1)*/ig, function(m) {
        return cfg[m];
    });
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
