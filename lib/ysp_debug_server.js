'use babel';

export default class YSPServer{

  var httpServer = null;

  constructor(serializedState) {

  }

  run(){
            var url = require('url');
              var http = require('http');
              var fs = require('fs');
              var path = require('path');
              var zlib = require("zlib");

              this.httpServer = http.createServer(function (req,res) {
                        var action = url.parse(req.url).pathname
                        if (action == '/closeServer') {
                               this.httpServer.close();
                               this.httpServer = null;
                        } else if (action == '/yspZip.zip') {
                                  var realPath = path.join("assets", path.normalize(action.replace(/\.\./g, "")));

res.write(realPath+"\r");

                                  path.exists(realPath, function (exists) {
                                         if (!exists) {
                                             res.writeHead(404, {'Content-Type': 'text/plain'});
                                             res.write("This request URL " + pathname + " was not found on this server.");
                                             res.end();
                                         } else {
                                             fs.readFile(realPath, "binary", function(err, file) {
                                                 if (err) {
                                                     res.writeHead(500, {'Content-Type': 'text/plain'});
                                                     res.end(err);
                                                 } else {
                                                     res.writeHead(200, {'Content-Type': 'application/zip'});
                                                     res.write(file, "binary");
                                                     res.end();
                                                 }
                                              });
                                           }
                                       });
                        }
                        res.end("action end");
              });
              this.httpServer.listen(2333);
              console.log('ysp server success');
  }

  stop() {
          this.httpServer.close();
          this.httpServer = null;
 }
}
