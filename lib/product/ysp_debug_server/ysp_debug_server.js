'use babel';

export default class YSPServer {

    httpServer: null;

    constructor(serializedState) {

    }

    run() {
        var url = require('url');
        var http = require('http');
        var fs = require('fs');
        var path = require('path');

        this.httpServer = http.createServer(function(req, res) {
            var action = url.parse(req.url).pathname
            if (action == '/closeServer') {
                this.httpServer.close();
                this.httpServer = null;
            } else if (action == '/yspZip.zip') {

                var rt = '/Users/pengjun/Desktop/yy-svn/entmobile_ios_branches/entmobile-ios_yypatch_feature/YYMobile/YYScriptPluginSDK/debug_tool/ysp_demo_server/test_plugin';
                createZip(rt, 'yspZip.zip');
                sleep(1000);

                var filePath = path.normalize(rt + '/' + 'yspZip.zip');
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
            res.end("action end1");
        });
        this.httpServer.listen(2333);
        console.log('ysp server success');
    }

    stop() {
        this.httpServer.close();
        this.httpServer = null;
    }
}

function createZip(root, filename) {
    var JSZip = require("jszip");
    var fs = require('fs');
    var path = require('path');

    var zip = new JSZip();

    addFile2Zip(zip, root)

    zip.generateNodeStream({
            type: 'nodebuffer',
            streamFiles: true
        })
        .pipe(fs.createWriteStream(path.normalize(root + '/' + filename)))
        .on('finish', function() {
            console.log("generate ziped");
        });
}

function addFile2Zip(zip, root) {
    var fs = require('fs');
    var path = require('path');

    var files = fs.readdirSync(root);
    files.forEach(function(file) {
        var filePath = path.normalize(root + '/' + file);
        if (fs.statSync(filePath).isFile()) {
            if (filePath.indexOf('.zip') < 0) {
                zip.file(file, fs.readFileSync(filePath));
            }
        }
        if (fs.statSync(filePath).isDirectory()) {
            addFile2Zip(zip.folder(file), filePath);
        }
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
