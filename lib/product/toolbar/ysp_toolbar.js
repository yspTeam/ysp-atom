'use babel';

export default class YSPToolBar {

    isShow: null;
    callback: null;
    nameArr: null;
    deviceArr: null;
    select_device: null
    DeviceTypeArr: null;
    select_device_type: null

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

        DeviceTypeArr = new Array();
        DeviceTypeArr[0] = "Simulator";
        DeviceTypeArr[1] = "iPhone";
        select_device_type = 0;
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
                    document.getElementById("ysp_toolbar_typename").addEventListener("click", selectTypeBtnClick);
                    document.getElementById("ysp_toolbar_simulator_name").addEventListener("click", simulatorBtnClick);
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

    showProgress(show, text, progress) {
        setProgress(show, text, progress);
    }

    setProjectInfo(ip, port) {
        document.getElementById("project_info").innerHTML = ip + ':' + port;
    }
}

function getToolbarHTML() {
    var runBtn = getRunBtn();
    var simulatorBtn = getSimulatorBtn();
    var settingBtn = getSettingBtn();
    var rightArea = getRightArea();
    return "<div class='ysp_toolbar' style='width:100%;height:32px;' id='ysp_toolbar'>\
    <ul style='margin-left:-30px'>\
    <li>" + runBtn + "</li>\
    <li>" + simulatorBtn + "</li>\
    <li>" + settingBtn + "</li>\
    </ul>\
    " + rightArea + "\
    </div>";
}

function getSimulatorBtn() {
    return "<a href='javascript:;'>\
    <div class='ysp_toolbar_simulator_btn'>\
    <img class='ysp_toolbar_simulator_btn_img' src='" + __dirname + "/res/yy_logo.png'/>\
    <label id='ysp_toolbar_typename'>YYMoble</label>\
    <img class='ysp_toolbar_simulator_btn_img_right' src='" + __dirname + "/res/right.png'/>\
    <label id='ysp_toolbar_simulator_name'>iPhone SE</label>\
    </div>\
    </a>";
}

function initSimulatorSelectView() {
    if (document.getElementById("simulator_selecter") != null) {
        document.getElementById("simulator_selecter").remove();
    }
    var body = document.body;
    var html = "<ul id='all_simulators'>";
    for (var i in nameArr) {
        html += "<li><a href='#'>" + nameArr[i] + "</a></li>";
    }
    html += "</ul>";

    var div = document.createElement("div");
    div.setAttribute('id', 'simulator_selecter');
    div.innerHTML = html;
    document.body.appendChild(div);

    var all_simulators = document.getElementById('all_simulators');
    var li_click = function(i) {
        all_simulators.childNodes[i].onclick = function() {
            selectSimulator(i);
        }
    }
    for (var i in all_simulators.childNodes) {
        li_click(i);
    }
}

function settypename2Label() {
    if (DeviceTypeArr.length > select_device_type) {
        document.getElementById("ysp_toolbar_typename").innerHTML = DeviceTypeArr[select_device_type];
    }
}

function setSimulator2Label() {
    if (nameArr.length > select_device) {
        document.getElementById("ysp_toolbar_simulator_name").innerHTML = nameArr[select_device];
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
    return "<div style='vertical-align: top;'>\
    <label id='project_info'></progress>\
    </div>"; //<span id='progress_title' class='inline-block' style='display:none'></span>\
}

function getProgressHTML() {
    return "<div class='block' style='vertical-align: bottom;'>\
    <progress id='progress' class='inline-block' max='1' value='0' style='display:none'></progress>\
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
    var isSimulator = (DeviceTypeArr[select_device_type] == "Simulator" ? true : false);
    callback("run", isSimulator);
}

function settingBtnClick() {
    callback("setting", null);
}

function selectSimulator(i) {
    select_device = i;
    callback("select_simulator", deviceArr[select_device])
    simulator_selecter.style.display = 'none';
    setSimulator2Label();
}

function simulatorBtnClick() {
    // callback("select_simulator");
    var simulator_selecter = document.getElementById('simulator_selecter');
    if (simulator_selecter != null) {
        if (simulator_selecter.style.display == 'block') {
            simulator_selecter.style.display = 'none';
        } else {
            simulator_selecter.style.display = 'block';
        }
    }
}

function documentClick() {}

function selectTypeBtnClick() {
    select_device_type = (select_device_type == 1 ? 0 : 1);
    settypename2Label();
}
