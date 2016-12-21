'use babel';

var zipRootPath = __dirname;
var thisRuning = false;

export default class YSPServer {

    httpServer: null;
    port: null;
    self: null;

    constructor(serializedState) {
        createZipFolder();
        console.log('ysp server zip root : ' + zipRootPath);
    }

    run() {
        self = this;
        if (thisRuning) {
            console.log('ysp server is running');
            return;
        }

        var http = require('http');
        var server = http.createServer();
        server.listen(0);
        server.on('listening', function() {
            var p = server.address().port;
            server.close();
            startServer(p);
        })
    }

    stop() {
        this.httpServer.close();
        console.log('ysp server closed');
        thisRuning = false;
    }

    isRunning() {
        return thisRuning;
    }

    generateZip(callback) {
        createZip(callback);
    }

    getServerPort() {
        return getServerPort();
    }
}

function getServerPort() {
    if (thisRuning) {
        return this.httpServer.address().port;
    }
    return 0;
}

function startServer(port) {
    var url = require('url');
    var http = require('http');
    var fs = require('fs');
    var path = require('path');

    this.httpServer = http.createServer(function(req, res) {
        var action = url.parse(req.url).pathname
        if (action == '/closeServer') {
            res.end("server closed");
            httpServer.close();
            console.log('ysp server closed');
            thisRuning = false;
        } else if (action == '/log') {
                  var log = url.parse(req.url, true).query;
            ysp_debug_log(decodeURI(log));
            res.end("log end");
        } else if (action == '/yspZip.zip') {
            createZip(function() {

                var projectPath = require('./common.js').rootPath();
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
                    res.end('zip success');
                } catch (e) {
                    res.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    res.end('zip not found');
                } finally {

                }

            });

            //   require('./common.js').sleep(10000);
            //   res.end("zip time out");
        }
        // res.end("action end");
    });
    this.httpServer.listen(port, () => {
        thisRuning = true;
        console.log('ysp server success , port:' + getServerPort());
    });
}

function createZipFolder() {
    var fs = require('fs');
    var path = require('path');

    zipRootPath = path.normalize(require('./common').rootPath() + '/build');
    try {
        fs.accessSync(zipRootPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipRootPath, 0777);
    }

    zipRootPath = path.normalize(require('./common').rootPath() + '/build/ios');
    try {
        fs.accessSync(zipRootPath, fs.F_OK);
    } catch (e) {
        fs.mkdirSync(zipRootPath, 0777);
    }
}

function createZip(callback) {
    var JSZip = require("jszip");
    var fs = require('fs');
    var path = require('path');
    var zip = new JSZip();

    createZipFolder();

    var projectPath = require('./common.js').rootPath();
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
            callback();
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

// function probe(port, callback) {
//     var server = net.createServer().listen(port)
//     var calledOnce = false
//     var timeoutRef = setTimeout(function() {
//         calledOnce = true
//         callback(false, port)
//     }, 10000)
//     timeoutRef.unref()
//
//     var connected = false
//     server.on('listening', function() {
//         clearTimeout(timeoutRef)
//
//         if (server)
//             server.close()
//
//         if (!calledOnce) {
//             calledOnce = true
//             callback(true, port)
//         }
//     })
//
//     server.on('error', function(err) {
//         clearTimeout(timeoutRef)
//
//         var result = true
//         if (err.code === 'EADDRINUSE')
//             result = false
//
//         if (!calledOnce) {
//             calledOnce = true
//             callback(result, port)
//         }
//     })
// }
