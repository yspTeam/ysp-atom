'use babel';
import YSPHttpServer from './ysp_http_server';
import YSPSocketServer from './ysp_socket_server';

var events = require('events');
var emitter = new events.EventEmitter();
var url = require('url');
var ysp_server_url = '';
var ysp_socket_stat = false;
var ysp_socket_clients = null;
export default class YSPServer {

    socketServer: null;
    httpServer: null;

    constructor(serializedState) {
        httpServer = new YSPHttpServer();
        socketServer = new YSPSocketServer();
    }

    run(callback) {
        httpServer.run(function(port) {
            socketServer.run(port);
            callback(port);
        });

        // 初始化回调
        httpServer.getTestUrl(function(url) {
            ysp_server_url = url;
        });
        socketServer.getSocketStat(function(stat, arrs) {
                  ysp_socket_stat = stat;
                  ysp_socket_clients = arrs;
        });
        emitter.on('http_restart', function(arg1, arg2){
                  console.log('http_restart');
                    //   httpServer.restart();
})
emitter.on('socket_restart', function(arg1, arg2){
          console.log('socket_restart');
    // socketServer.restart();
})

        window.setTimeout(beginServerChecker, 5000);
    }

    stop() {
        httpServer.stop();
    }

    getHttpServer() {
        return httpServer;
    }

        getSocketServer() {
            return socketServer;
        }

    runDevice() {
        socketServer.sendCommand_D();
    }

    beatCallback: null;
    setStatuBeat(callback) {
        beatCallback = callback;
    }
}

function beginServerChecker() {
    window.setInterval(checkServerStatu, 3000);
}

function checkServerStatu() {
    try {
        checkHttpServer(function(stat) {
            checkSocketServer(function(stat1, arrs) {
                if (beatCallback != null) {
                    var msg = "ysp server 运行中";
                    var ok = true;
                    if (!stat) {
                        msg = "http server 异常";
                        ok = false;
                        emitter.emit('http_restart', '', '');
                    }
                    if (!stat1) {
                        msg = "socket server 异常";
                        ok = false;
                        emitter.emit('socket_restart', '', '');
                    }
                    beatCallback(ok, msg, arrs);
                }
            });
        });
    } catch (e) {
        console.error(e);
    } finally {

    }
}

function checkHttpServer(callback) {
    var parsedUrl = url.parse(ysp_server_url, true);
    var options = {
        host: "null",
        port: -1,
        path: null,
        method: 'GET'
    };
    options.host = parsedUrl.hostname;
    options.port = parsedUrl.port;
    options.path = parsedUrl.pathname;
    if (parsedUrl.search) options.path += "?" + parsedUrl.search;
    var http = require('http');
    var req = http.request(options, function(res) {
        callback(true);
    });
    req.on('error', function(err) {
        callback(false);
    });
    req.end();
}

function checkSocketServer(callback) {
    callback(ysp_socket_stat, ysp_socket_clients);
}
