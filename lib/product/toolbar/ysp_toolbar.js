'use babel';

export default class YSPToolBar {

    isShow: null;
    callback: null;
    nameArr: null;
    deviceArr: null;
    select_device: null
    projectArr: null;
    select_project: null

    constructor(serializedState) {
        this.isShow = false;
        var toolbar_css = document.createElement("link")
        toolbar_css.rel = "stylesheet";
        toolbar_css.type = "text/css";
        toolbar_css.href = __dirname + "/res/toolbar_css.css";
        toolbar_css.media = "screen";
        var headobj = document.getElementsByTagName('head')[0];
        headobj.appendChild(toolbar_css);
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
                    document.getElementById("ysp_toolbar_projectname").addEventListener("click", selectProjectBtnClick);
                    document.getElementById("ysp_toolbar_simulator_name").addEventListener("click", simulatorBtnClick);
                    break;
                }
            }
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
    setProject(pArr) {
        projectArr = pArr;
        select_project = 0;
        setProjectName2Label();
    }

    setCallback(cb) {
        callback = cb;
    }
}

function getToolbarHTML() {
    var runBtn = getRunBtn();
    var simulatorBtn = getSimulatorBtn();
    return "<div class='ysp_toolbar' style='width:100%;height:32px;' id='ysp_toolbar'>\
    <ul style='margin-left:-30px'>\
    <li>" + runBtn + "</li>\
    <li>" + simulatorBtn + "</li>\
    </ul>\
    " + getAboutTips() + "\
    </div>";
}

function getSimulatorBtn() {
    return "<a href='javascript:;'>\
    <div class='ysp_toolbar_simulator_btn'>\
    <img class='ysp_toolbar_simulator_btn_img' src='" + __dirname + "/res/yy_logo.png'/>\
    <label id='ysp_toolbar_projectname'>YYMoble</label>\
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

function setProjectName2Label() {
    if (projectArr.length > select_project) {
        document.getElementById("ysp_toolbar_projectname").innerHTML = projectArr[select_project];
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
    <img src='" + __dirname + "/res/run.png'/>\
    </div>\
    </a>";
}

function getAboutTips() {
    return "<label class='ysp_toolbar_tips'>YSP 调试工具</label>";
}

//method
function runBtnClick() {
    callback("run", "");
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

function selectProjectBtnClick() {
    console.log('selectProjectBtnClick');
}
