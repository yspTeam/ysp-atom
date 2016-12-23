'use babel';

export default class YSPSocketServer {
    clientList = [];
    constructor(serializedState) {}

    run() {
        var net = require('net');
        var socketServer = net.createServer();
        socketServer.on('connection', function(client) {
            client.name = client.remoteAddress + ':' + client.remotePort;
            client.write('ysp server ready!');
            clientList.push(client);
            client.on('data', function(data) {
                receiveData(data, client);
            });
            client.on('end', function() {
                clientList.splice(clientList.indexOf(client), 1);
            });
            client.on('error', function(e) {
                console.log('ysp socket error:' + e);
            });
        });
        socketServer.listen(0);
    }
}

function receiveData(msg, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client !== clientList[i]) {
            console.log('receive ' + client.name + ':' + msg);
            if (clientList[i].writable) {
                actionThrow(msg);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }
    for (i = 0; i < cleanup.length; i += 1) {
        clientList.splice(clientList.indexOf(cleanup[i]), 1)
    }
}

function actionThrow(msg) {

}

function log(l) {
    require('./ysp_log.js').ysp_log(l);
}
