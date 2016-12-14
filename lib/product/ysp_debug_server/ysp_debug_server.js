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

                var realPath = path.join("zip_cache", path.normalize(action.replace(/\.\./g, "")));

          //       this.createZip('/Users/pengjun/Desktop/yy-svn/entmobile_ios_branches/entmobile-ios_yypatch_feature/YYMobile/YYScriptPluginSDK/debug_tool/ysp_demo_server/test_plugin', 'yspZip.zip')
          var JSZip = require("jszip");
          var zip = new JSZip();

var rt = '/Users/pengjun/Desktop/yy-svn/entmobile_ios_branches/entmobile-ios_yypatch_feature/YYMobile/YYScriptPluginSDK/debug_tool/ysp_demo_server/test_plugin';
          fs.readdir(rt,
             function(err, files) {
                  if (err) {
                      console.error(err);
                      return;
                  } else {
                      files.forEach(function(file) {
                         var filePath = path.normalize(root + '/' + file);
                         res.write('----------addfule:'+filePath + "\r");
                    //      zip.file(file, fs.readFileSync(filePath));
                      });
                  }
             });

          var zipfolder = zip.generateAsync({
             base64:false,
             compression:'DEFLATE'
          });
          fs.writeFile('yspZip.zip', zipfolder, function(err) {
             if (err) throw err;
          });


                var filePath = path.normalize('/Users/pengjun/Desktop/yy-svn/entmobile_ios_branches/entmobile-ios_yypatch_feature/YYMobile/YYScriptPluginSDK/debug_tool/ysp_demo_server/test_plugin' + '/' + 'yspZip.zip');
                res.write(filePath + "\r");

                fs.readFile(filePath, "binary", function(err, file) {
                    if (err) {
                        res.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        res.end(err);
                    } else {
                        res.writeHead(200, {
                            'Content-Type': 'application/zip'
                        });
                        res.write(file, "binary");
                        res.end();
                    }
                });
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

    static createZip(root, filename) {
        var jszip = require("jszip");
        var zip = new JSZip();

        fs.readdir(root,
            function(err, files) {
                if (err) {
                    console.error(err);
                    return;
                } else {
                    files.forEach(function(file) {
                        var filePath = path.normalize(root + '/' + file);
                        zip.file("a.txt", fs.readFileSync(filePath));
                    });
                }
            });

        var zipfolder = zip.generate({
            base64:false,
            compression:'DEFLATE'
        });
        fs.writeFile(filename, zipfolder, function(err) {
            if (err) throw err;
        });
    }
}
