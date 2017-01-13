'use babel';

import YSPSocketClientView from './view/ysp_socket_client_view';
export default class YSPToolBar {

    isShow: null;
    callback: null;
    PlatformTypeArr: null;
    select_platform_type: null;
    socket_clients: null

    constructor(serializedState) {
        this.isShow = false;
        //初始化css
        var toolbar_css = document.createElement("link")
        toolbar_css.rel = "stylesheet";
        toolbar_css.type = "text/css";
        toolbar_css.href = __dirname + "/res/toolbar_css.css";
        toolbar_css.media = "screen";
        var headobj = document.getElementsByTagName('head')[0];
        headobj.appendChild(toolbar_css);

        PlatformTypeArr = new Array();
        PlatformTypeArr[0] = "iOS";
        PlatformTypeArr[1] = "Android";
        select_platform_type = 0;

        initEmitter();
    }

    show() {
        if (this.isShow == true) {
            this.isShow = false;
            document.getElementById("ysp_toolbar").remove();
        } else {
            this.isShow = true;
            var tags = document.getElementsByTagName('atom-panel-container')
            for (var i in tags) {
                if (tags[i].className == 'top') {
                    tags[i].innerHTML += getToolbarHTML();

                    //add click listener
                    document.getElementById("yspRun").addEventListener("click", runBtnClick);
                    document.getElementById("yspSetting").addEventListener("click", settingBtnClick);
                    document.getElementById("ysp_toolbar_platfrom").addEventListener("click", selectTypeBtnClick);
                    break;
                }
            }

            settypename2Label();
        }
    }

    setDeviceArr(nArr, dArr) {
        nameArr = nArr;
        deviceArr = dArr;

        //排个序
        for (var i = 0; i < nameArr.length - 1; i++) {
            for (var x = 0; x < nameArr.length - 1 - i; x++) {
                if (nameArr[x] > nameArr[x + 1]) {
                    var a = nameArr[x + 1];
                    nameArr[x + 1] = nameArr[x];
                    nameArr[x] = a;

                    var b = deviceArr[x + 1];
                    deviceArr[x + 1] = deviceArr[x];
                    deviceArr[x] = b;
                }
            }
        }

        initSimulatorSelectView();
    }

    setCallback(cb) {
        callback = cb;
    }

    setProjectInfo(ip, port) {
        document.getElementById("project_info").innerHTML = ip + ':' + port;
    }

    setShining(enable, msg, clients) {
        shining(enable, msg, clients);
    }
}

function initEmitter() {
    require('./../common').emitter().on('ysp_toolbar_setProgress', function(show, text, progress) {
        setProgress(show, text, progress);
    });
}

function getToolbarHTML() {
    var runBtn = getRunBtn();
    var platformBtn = getPlatformBtn();
    var settingBtn = getSettingBtn();
    var rightArea = getRightArea();
    return "<div class='ysp_toolbar' style='width:100%;height:32px;' id='ysp_toolbar'>\
    <ul style='margin-left:-30px'>\
    <li>" + runBtn + "</li>\
    <li>" + platformBtn + "</li>\
    <li>" + settingBtn + "</li>\
    </ul>\
    " + rightArea + "\
    </div>";
}

function getPlatformBtn() {
    return "<a href='javascript:;' style='display:none'>\
    <div class='ysp_toolbar_platfrom_btn'>\
    <img id='ysp_toolbar_platfrom_icon' class='ysp_toolbar_platfrom_btn_img' src='" + __dirname + "/res/ios.png'/>\
    <label id='ysp_toolbar_platfrom'>iOS</label>\
    </div>\
    </a>";
}

function settypename2Label() {
    if (PlatformTypeArr.length > select_platform_type) {
        document.getElementById("ysp_toolbar_platfrom").innerHTML = PlatformTypeArr[select_platform_type];
        document.getElementById("ysp_toolbar_platfrom_icon").src = __dirname + "/res/"+PlatformTypeArr[select_platform_type]+".png";
    }
}

function getRunBtn() {
    return "<a href='javascript:;' id='yspRun'>\
    <div class='ysp_toolbar_btn'>\
    <span class='icon icon-playback-play'/>\
    </div>\
    </a>";
}

function getSettingBtn() {
    return "<a href='javascript:;' id='yspSetting'>\
    <div class='ysp_toolbar_btn'>\
    <span class='icon icon-gear'/>\
    </div>\
    </a>";
}

function getRightArea() {
    var infoView = getInfoHTML();
    var progressView = getProgressHTML();
    return "<div class='ysp_toolbar_right'>\
    " + infoView + "\
    " + progressView + "\
    \
    </div>";
}

function getInfoHTML() {
    var sha = getServerStatu();
    return "<div style='vertical-align: top;'>\
    <label id='project_info'></label>\
    " + sha + "\
    </div>"; //<span id='progress_title' class='inline-block' style='display:none'></span>\
}

function getServerStatu() {
    // window.setInterval(shining(this.shining_enable), 2000);
    return "<span id='server_shining' class='badge icon icon-link'>0</span>";
}

function shining(enable, msg, clients) {
    // this.shining_enable = enable;
    var server_shining = document.getElementById('server_shining');
    if (server_shining == null) {
        return;
    }
    server_shining.title = msg;
    var clientCount = 0;
    if (clients != null) {
        clientCount = clients.length;
        socket_clients = clients;
    }
    server_shining.innerHTML = clientCount;
    server_shining.removeEventListener("click", clickSocketServerIcon);
    if (enable) {
        // if (server_shining.className != 'badge icon icon-link') {
        //     server_shining.className = 'badge icon icon-link';
        // } else {
        server_shining.className = 'badge badge-success icon icon-link';
        // }
        server_shining.addEventListener("click", clickSocketServerIcon);

    } else {
        server_shining.className = 'badge icon icon-link';
    }
}

function getProgressHTML() {
    return "<div class='block' style='vertical-align: bottom;'>\
    <progress id='progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
    </div>"; //<span id='progress_title' class='inline-block' style='display:none'></span>\
}

function setProgress(show, text, progress) {
    if (show) {
        // document.getElementById("progress_title").style.display = 'block';
        document.getElementById("progress").style.display = 'block';
        // document.getElementById("progress_title").innerHTML = text;
        document.getElementById("progress").value = progress;
    } else {
        // document.getElementById("progress_title").style.display = 'none';
        document.getElementById("progress").style.display = 'none';
    }
}

function getLoadingView() {
    return "<span id='loading' class='loading loading-spinner-large inline-block'></span>";
}

//method
function runBtnClick() {
    callback("run", PlatformTypeArr[select_platform_type]);
}

function settingBtnClick() {
    callback("setting", null);
}

function selectTypeBtnClick() {
    select_platform_type = (select_platform_type == 1 ? 0 : 1);
    settypename2Label();
}

function clickSocketServerIcon() {
    new YSPSocketClientView().show(socket_clients);
}
