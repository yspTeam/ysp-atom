'use babel';

export default class YSPToolBar {

    isShow: null;
    callback:null

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
                    break;
                }
            }
        }
    }

setCallback(cb) {
          callback = cb;
}
}

function getToolbarHTML() {
    var runBtn = getRunBtn();
    return "<div class='ysp_toolbar' style='width:100%;height:32px;' id='ysp_toolbar'>\
                    <ul style='margin-left:-30px'>\
                              <li>" + runBtn + "</li>\
                    </ul>\
                    " + getAboutTips() + "\
          </div>";
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
          callback("run");
}
