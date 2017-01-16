'use babel';

var exec = require('child_process').exec;
export default class YSPSocketServer {
    clientList: null;
    projectName: null;
    socketServer: null;
    socket_stat_changed: null;
    socket_stat: null;
    socket_port: null;

    constructor(serializedState) {
        clientList = new Array();

        var path = require('path');
        var projectPath = require('./../common').rootPath();
        var tmp = projectPath.split(path.sep);
        projectName = tmp[tmp.length - 1];
    }

    run(port) {
        var net = require('net');
        socketServer = net.createServer();
        socketServer.on('connection', function(client) {
            client.name = client.remoteAddress + ':' + client.remotePort;
            console.info('ysp socket new client : 【' + client.name + '】');

            //连接上时，自动刷新一次
            clientWriteData(client, '{\
                      "openid":"' + projectName + '",\
                      "ver":"' + require('./../common').pluginVersion() + '",\
                      "command_d_auto":"1"\
            }');

            clientList.push(client);
            handleSocketStat();
            client.on('data', function(data) {
                receiveData(data, client);
            });
            client.on('end', function() {
                console.info('ysp socket close client : 【' + client.name + '】');
                clientList.splice(clientList.indexOf(client), 1);
                handleSocketStat();
            });
            client.on('error', function(e) {
                console.error('ysp socket error : ' + e);
            });

        });
        socketServer.on('error', function(e) {
            socket_stat = false;
            alert('ysp socket server fail : ' + e);
        });
        socketServer.on('end', function() {
            socket_stat = false;
            console.error('ysp socket server closed');
        });
        socketServer.listen(port + 1, () => {
            socket_stat = true;
            console.info('ysp socket server success');
            socket_port = socketServer.address().port;

            socket_stat_changed(socket_stat, []);
        });
    }
    restart() {
        socketServer.close();
        socketServer = null;
        socket_stat = false;
        run(socket_port);
    }

    getSocketStat(callback) {
        socket_stat_changed = callback;
    }

    sendReload2Phone() {
        var cleanup = [];
        for (var i = 0; i < clientList.length; i += 1) {
            if (clientList[i].writable) {
                if (clientList[i].device_type == "phone") {
                    clientWriteData(clientList[i], '{"exit":1}');
                }
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
        for (i = 0; i < cleanup.length; i += 1) {
            console.info('ysp socket close client : ' + cleanup[i].name);
            clientList.splice(clientList.indexOf(cleanup[i]), 1);
        }
        handleSocketStat();
    }
    sendReload2Device() {
        var cleanup = [];
        for (var i = 0; i < clientList.length; i += 1) {
            if (clientList[i].writable) {
                clientWriteData(clientList[i], '{\
                          "openid":"' + projectName + '",\
                          "ver":"' + require('./../common').pluginVersion() + '",\
                          "command_d":"1"\
                              }');
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
        for (i = 0; i < cleanup.length; i += 1) {
            console.info('ysp socket close client : ' + cleanup[i].name);
            clientList.splice(clientList.indexOf(cleanup[i]), 1);
        }
        handleSocketStat();
    }
}

function handleSocketStat() {
    var names = new Array();
    for (var i in clientList) {
        var name = clientList[i].device_name + " (" + clientList[i].system_name + ")";
        //     if (clientList[i].device_type != "phone") {
        //             name += " <label style='color:#eee'>" + clientList[i].device_type + "</label>";
        //     }
        names[i] = name;
    }
    if (window.socket_stat_changed != null) {
        socket_stat_changed(socket_stat, names);
    }

    // var ip = require('./../common').getLocalIp();
    // exec('telnet ' + ip + ' ' + socket_port, function(err, stdout, stderr) {
    //    if (!err) {
    //         var names = new Array();
    //         for (var i in clientList) {
    //             names[i] = clientList[i].name;
    //         }
    //         socket_stat_changed(true, names);
    //         return names;
    //    } else {
    //         socket_stat_changed(false, null);
    //    }
    // });
}

//接收数据
function receiveData(msg, client) {
    var cleanup = [];
    for (var i = 0; i < clientList.length; i += 1) {
        if (client == clientList[i]) {
            if (clientList[i].writable) {
                var m = '[' + msg.toString() + ']';
                if (m.indexOf('}{') > 0) {
                    //多条数据增加转译
                    m = m.replace(new RegExp(/(}{)/g), '},{');
                }
                msg2action(m, client);
            } else {
                cleanup.push(clientList[i]);
                clientList[i].destroy();
            }
        }
    }
    for (i = 0; i < cleanup.length; i += 1) {
        console.info('ysp socket close client : 【' + cleanup[i].name + '】');
        clientList.splice(clientList.indexOf(cleanup[i]), 1);
    }
    handleSocketStat();
}

// {'action':'xxx','data','XXX'}
function msg2action(msg, client) {
    if (msg.indexOf('zip') > 0) {
        return;
    }

    try {
        var arr = JSON.parse(msg);
        if (arr != null) {
            for (var i in arr) {
                switch (arr[i].action) {
                    case 'log':
                        var t = arr[i].data.type;
                        var l = arr[i].data.msg;
                        log(t, l);
                        break;
                    case 'info':
                        client.device_type = arr[i].data.device_type;
                        client.device_name = arr[i].data.device_name;
                        client.system_name = arr[i].data.system_name;
                        break;
                    default:
                }
            }
        }
    } catch (e) {

    } finally {

    }
}

function log(type, l) {
    require('./../ysp_log.js').ysp_log(type, l);
}

//发送数据
function clientWriteData(client, data) {
    client.write(data + "\r\n");
}
