'use babel';

import ProjectConfig from './../../../project-config.js';

export default class YSPSettingView {

    constructor(serializedState) {

    }

    hid() {
        if (document.getElementById("ysp_setting_parent_view") != null) {
            document.getElementById("ysp_setting_parent_view").remove();
        }
    }

    show(callback) {
        if (document.getElementById("ysp_setting_parent_view") != null) {
            document.getElementById("ysp_setting_parent_view").remove();
        }
        var body = document.body;
        var html = "\
        <div id='ysp_setting_view_bg'>\
          <div class='block' id='ysp_setting_view'>\
                    <label id='begin_download_label'>手Y压缩包url地址</label><br/>\
                    <input class='input-text' type='text' placeholder='Text' id='download_url' >\
                    <button class='btn' id='begin_download'>开始下载</button>\
          </div>\
        </div>"; //<span id='ysp_x_close_setting_view' class='icon icon-x'/>

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_setting_parent_view');
        div.innerHTML = html;
        document.body.appendChild(div);

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
        var btn = document.getElementById('begin_download');
        btn.onclick = function() {
            var txt = document.getElementById('download_url').value;
            callback("begin_download", txt, function() {
                ProjectConfig.setMasterAppUpdated(true);
                console.info('手Y下载完毕');
            });
        }

        loadProjectConfig();
    }
}

function loadProjectConfig() {
    var url = ProjectConfig.masterAppUpdateURL();
// url = 'http://damoreport.bs2cdn.yy.com/C394A491-D8B1-4394-8C1C-DAA9B7661080.zip';
    document.getElementById('download_url').value = url;
    var isupdate = ProjectConfig.masterAppUpdated();
    if (isupdate) {
        document.getElementById('begin_download_label').innerHTML += '【已下载】';
    }
}
