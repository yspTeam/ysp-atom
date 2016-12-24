'use babel';

export default class YSPSocketServer {
    clientList = null;
    constructor(serializedState) {
clientList = new Array();
   }

    run(port) {
        var net = require('net');
        var socketServer = net.createServer();
        socketServer.on('connection', function(client) {
            client.name = client.remoteAddress + ':' + client.remotePort;
            console.log('ysp socket new client : '+client.name);
            clientList.push(client);
            client.on('data', function(data) {
                receiveData(data, client);
            });
            client.on('end', function() {
                      console.log('ysp socket close client : '+client.name);
                clientList.splice(clientList.indexOf(client), 1);
            });
            client.on('error', function(e) {
                console.log('ysp socket error:' + e);
            });
        });
        socketServer.on('error',function(e){
                  console.log('ysp socket server fail : '+e);
        });
        socketServer.listen(port+1 , () => {
            console.log('ysp socket server success , port:' + socketServer.address().port);
        });
    }
}

function receiveData(msg, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client == clientList[i]) {
            if (clientList[i].writable) {
                msg2action(msg);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
 }
    }
    for (i = 0; i < cleanup.length; i += 1) {
              console.log('ysp socket close client : '+cleanup[i].name);
        clientList.splice(clientList.indexOf(cleanup[i]), 1)
    }
}

// {'action':'log','data','XXX'}
function msg2action(msg) {
          if (msg=='yspbeat') {return;}
          if (msg.indexOf('zip')>0) {return;}

          var j = JSON.parse(msg);
          if (j != null) {
                    switch (j.action) {
                              case 'log':
                                        log(j.data);
                                        break;
                              default:

                    }
          }
}

function log(l) {
    require('./ysp_log.js').ysp_log(l);
}
