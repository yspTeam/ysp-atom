'use babel';

export default class YSPHttpDownloader {

    constructor(serializedState) {}

    download(urlStr,callback) {
        var http = require('http');
        var url = require('url');

        var parsedUrl = url.parse(urlStr, true);

        var options = {
            host: null,
            port: -1,
            path: null,
            method: 'GET'
        };
        options.host = parsedUrl.hostname;
        options.port = parsedUrl.port;
        options.path = parsedUrl.pathname;
        if (parsedUrl.search) options.path += "?" + parsedUrl.search;
        var req = http.request(options, function(res) {
          //   console.log('STATUS: ' + res.statusCode);
          //   console.log('HEADERS: ' + res.headers);
          //   res.setEncoding('utf8');
            res.on('data', function(data) {
                    //   console.log('BODY: ' + data);
                      callback(1,false);
            });
            res.on('error', function(err) {
                console.log('RESPONSE ERROR: ' + err);
            });
            res.on('end', function(err) {
                      callback(0,true);
            });
        });

        req.on('error', function(err) {
            console.log('REQUEST ERROR: ' + err);
        });
        req.end();
    }
}
