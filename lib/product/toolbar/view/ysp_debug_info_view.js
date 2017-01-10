'use babel';

import ProjectConfig from './../../../project-config.js';

export default class YSPSettingDebugView {

    constructor(serializedState) {

    }

    show(htmltag) {
        if (document.getElementById("ysp_debug_info_parent_view") != null) {
            document.getElementById("ysp_debug_info_parent_view").remove();
        }
        var body = document.body;
        var html = "\
        <div id='ysp_debug_info_view_bg'>\
          <div class='block' id='ysp_debug_info_view'>\
          <label class='input-label'><input class='input-toggle' type='checkbox' checked style='width:30px;'> 开启快速调试</label>\
          </div>\
        </div>"; //<span id='ysp_x_close_debug_info_view' class='icon icon-x'/>

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_debug_info_parent_view');
        div.innerHTML = html;
        document.getElementById(htmltag).innerHTML = "";
        document.getElementById(htmltag).appendChild(div);

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
