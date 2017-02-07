'use babel';
import YSPSettingDownloadView from './ysp_download_yy_view';
import YSPSettingDebugView from './ysp_debug_info_view';
import YSPSettingSimulatorView from './ysp_simulator_view';

var menus = new Array();
export default class YSPSettingView {

    constructor(serializedState) {
        menus[0] = 'Debug';
        menus[1] = 'Simulator';
        menus[2] = 'Download';
    }

    show() {
        if (document.getElementById("ysp_setting_parent_view") != null) {
            document.getElementById("ysp_setting_parent_view").remove();
        }
        var body = document.body;
        var lis = "";
        for (var i in menus) {
            lis += "<li class='list-item'>\
                              " + menus[i] + "\
                        </li>";
        } //<span class='no-icon'>" + menus[i] + "</span>\
        var html = "\
        <div id='ysp_setting_view_bg'>\
          <div class='block' id='ysp_setting_left_view'>\
                    <ul id='ysp_setting_left_ul' class='list-group'>" + lis + "</ul>\
          </div>\
          <div class='block' id='ysp_setting_view'>\
          </div>\
        </div>\
        ";
        // <li class='list-nested-item'>\
        //     <div class='list-item'>\
        //         <span class='icon icon-file-directory'>Nested Directory</span>\
        //     </div>\
        //     <ul class='list-tree'>\
        //         <li class='list-item'>\
        //            <span class='icon icon-file-text'>File one</span>\
        //         </li>\
        //     </ul>\
        // </li>\

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_setting_parent_view');
        div.innerHTML = html;
        document.body.appendChild(div);

        initCloseView();
        initClick();
    }
}

function initCloseView() {
    var d = document.getElementById('ysp_setting_parent_view');
    d.onclick = function(ev) {

        var x = ev.clientX;
        var y = ev.clientY;
        var p = document.getElementById('ysp_setting_view_bg');
        if (p == null) {
            return;
        }
        if (x > p.getBoundingClientRect().left && x < (p.getBoundingClientRect().left + p.getBoundingClientRect().width) &&
            y > p.getBoundingClientRect().top && y < (p.getBoundingClientRect().top + p.getBoundingClientRect().height)) {} else {
            if (document.getElementById("ysp_setting_parent_view") != null) {
                document.getElementById("ysp_setting_parent_view").remove();
            }
        }
    }
}

function initClick() {

    var all = document.getElementById('ysp_setting_left_ul');
    var li_click = function(i) {
        all.childNodes[i].onclick = function() {
            for (var j in menus) {
                document.getElementById('ysp_setting_left_ul').childNodes[j].style.backgroundColor = '';
            }
            document.getElementById('ysp_setting_left_ul').childNodes[i].style.backgroundColor = '#555555';
            switch (menus[i]) {
                case "Debug":
                    new YSPSettingDebugView().show('ysp_setting_view');
                    break;
                case "Simulator":
                    new YSPSettingSimulatorView().show('ysp_setting_view');
                    break;
                case "Download":
                    new YSPSettingDownloadView().show('ysp_setting_view');
                    break;
            }
        }
    }
    for (var i in all.childNodes) {
        li_click(i);
    }
    //默认打开第一个
    all.childNodes[0].style.backgroundColor = '#555555';
    new YSPSettingDebugView().show('ysp_setting_view');
}

function hid() {
    if (document.getElementById("ysp_setting_parent_view") != null) {
        document.getElementById("ysp_setting_parent_view").remove();
    }
}
