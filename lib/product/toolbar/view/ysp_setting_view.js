'use babel';
import YSPSettingDownloadView from './ysp_download_yy_view';
import YSPSettingDebugView from './ysp_debug_info_view';
import YSPHttpDownloader from './../http_downloader';

var events = require('events');
var emitter = new events.EventEmitter();
var menus = new Array();
export default class YSPSettingView {

    downloader: null;

    constructor(serializedState) {
        //初始化下载类
        downloader = new YSPHttpDownloader();

        menus[0] = 'Debug';
        menus[1] = 'Download';
    }

    show() {
        if (document.getElementById("ysp_setting_parent_view") != null) {
            document.getElementById("ysp_setting_parent_view").remove();
        }
        var body = document.body;
        var lis = "";
        for (var i in menus) {
            lis += "<li class='list-item'>\
                              <span class='no-icon'>" + menus[i] + "</span>\
                        </li>";
        }
        var html = "\
        <div id='ysp_setting_view_bg'>\
        <div class='block' id='ysp_setting_left_view'>\
          <ul id='ysp_setting_left_ul' class='list-tree'>" + lis + "</ul>\
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
            document.getElementById('ysp_setting_left_ul').childNodes[i].style.backgroundColor = '#777777';
            switch (menus[i]) {
                case "Debug":
                    break;
                case "Download":
                    new YSPSettingDownloadView().show('ysp_setting_view', function(action, data, complate) {
                        switch (action) {
                            case "begin_download":
                                var url = data;
                                emitter.emit(true, 'downloading', 0);
                                downloader.download(url, function(progress, complate) {
                                    emitter.emit(!complate, 'downloading', progress);
                                    if (complate) {
                                        complate();
                                    }
                                });
                                //   hid();
                                break;
                            default:

                        }
                    });
                    break;
            }
        }
    }
    for (var i in all.childNodes) {
        li_click(i);
    }
    //默认打开第一个
    all.childNodes[0].style.backgroundColor = '#777777';
    new YSPSettingDebugView().show('ysp_setting_view');
}

function hid() {
    if (document.getElementById("ysp_setting_parent_view") != null) {
        document.getElementById("ysp_setting_parent_view").remove();
    }
}
