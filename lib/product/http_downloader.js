'use babel';

var fs = require('fs');
var path = require('path');
var http = require('http');
var url = require('url');
var exec = require('child_process').exec;
export default class YSPHttpDownloader {

    unzipPath: null;
    downloadCachePath: null;
    isReady: null

    constructor(serializedState) {
        isReady = false;
        unzipPath = path.join(__dirname, 'download');
        downloadCachePath = path.join(unzipPath, 'cache');
        try {
            var mkdir = 'mkdir -p ' + downloadCachePath;
            var child = exec(mkdir, function(err, stdout, stderr) {
                if (err) throw err;
                isReady = true;
            });
        } catch (e) {
            console.error('创建cache目录失败：' + e);
        } finally {

        }
        this.b = false;
    }

    download(urlStr, callback) {
        if (!isReady) {
            console.warn('上一个下载还未完成');
            return;
        }
        isReady = false;
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

        var filename = parsedUrl.pathname.substring(1);
        if (filename.indexOf('/') > 0) {
            filename = filename.substring(filename.lastIndexOf('/') + 1);
        }
        var filepath = path.join(downloadCachePath, filename);
        var file = fs.createWriteStream(filepath);
        var progress = 1;
        var req = http.request(options, function(res) {
            var maxProgress = res.headers['content-length'];
            var nowProgress = 0;
            res.on('data', function(data) {
                file.write(data);
                nowProgress += data.length;
                callback(nowProgress / maxProgress, false);
            });
            res.on('error', function(err) {
                file.end();
                isReady = true;
                console.error('RESPONSE ERROR: ' + err);
            });
            res.on('end', function(err) {
                file.end();
                //解压
                exec('unzip '+filepath+' -d '+unzipPath);
                //外部处理
                callback(0, true);
                isReady = true;
            });
        });
        req.on('error', function(err) {
            isReady = true;
            callback(0, true);
            console.error('download url error：' + err);
        });
        req.end();
    }
}
