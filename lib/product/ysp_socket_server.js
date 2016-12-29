'use babel';

export default class YSPSocketServer {
    clientList = null;
    projectName: null;

    constructor(serializedState) {
        clientList = new Array();

        var path = require('path');
        var projectPath = require('./common').rootPath();
        var tmp = projectPath.split(path.sep);
        projectName = tmp[tmp.length - 1];
    }

    run(port) {
        var net = require('net');
        var socketServer = net.createServer();
        socketServer.on('connection', function(client) {
            client.name = client.remoteAddress + ':' + client.remotePort;
            console.info('ysp socket new client : 【' + client.name + '】');

            //连接上时，自动刷新一次
            clientWriteData(client, '{"openid":"' + projectName + '","command_d":"1"}');

            clientList.push(client);
            client.on('data', function(data) {
                receiveData(data, client);
            });
            client.on('end', function() {
                console.info('ysp socket close client : 【' + client.name + '】');
                clientList.splice(clientList.indexOf(client), 1);
            });
            client.on('error', function(e) {
                console.error('ysp socket error : ' + e);
            });
        });
        socketServer.on('error', function(e) {
            console.error('ysp socket server fail : ' + e);
        });
        socketServer.listen(port + 1, () => {
            console.info('ysp socket server success');
        });
    }

    sendCommand_D() {
        var cleanup = [];
        for (var i = 0; i < clientList.length; i += 1) {
            if (clientList[i].writable) {
                //   if (clientList[i].device_type == "iphone") {
                clientWriteData(clientList[i], '{"openid":"' + projectName + '","command_d":"1"}');
                // }
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
        for (i = 0; i < cleanup.length; i += 1) {
            console.info('ysp socket close client : ' + cleanup[i].name);
            clientList.splice(clientList.indexOf(cleanup[i]), 1)
        }
    }
}

//接收数据
function receiveData(msg, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client == clientList[i]) {
            if (clientList[i].writable) {
                msg2action(msg, client);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }
    for (i = 0; i < cleanup.length; i += 1) {
        console.info('ysp socket close client : 【' + cleanup[i].name + '】');
        clientList.splice(clientList.indexOf(cleanup[i]), 1)
    }
}

// {'action':'xxx','data','XXX'}
function msg2action(msg, client) {
    if (msg.indexOf('zip') > 0) {
        return;
    }

    try {
        var j = JSON.parse(msg);
        if (j != null) {
            switch (j.action) {
                case 'log':
                    var t = j.data.type;
                    var l = j.data.msg;
                    log(t, l);
                    break;
                case 'info':
                    client.device_type = j.data.device_type;
                    break;
                default:

            }
        }
    } catch (e) {

    } finally {

    }
}

function log(type, l) {
    require('./ysp_log.js').ysp_log(type, l);
}

//发送数据
function clientWriteData(client, data) {
    client.write(data);
}
