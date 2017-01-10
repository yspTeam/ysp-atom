'use babel';

import ProjectConfig from './../../../project-config.js';

export default class YSPSettingDownloadView {

    constructor(serializedState) {}

    show(htmltag, callback) {
        if (document.getElementById("ysp_download_yy_parent_view") != null) {
            document.getElementById("ysp_download_yy_parent_view").remove();
        }
        var body = document.body;
        var html = "\
        <div id='ysp_download_yy_view_bg' style='margin-top:10px'>\
          <div class='block' id='ysp_download_yy_view_ios'>\
                    <label id='begin_download_label_ios'>宿主 iOS url：</label><br/>\
                    <input class='input-text' type='text' placeholder='Text' id='download_url_ios' />\
                    <button class='btn' id='begin_download_ios'>开始下载<br/>\
                         <progress id='begin_download_ios_progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
                    </button>\
          </div>\
          <div class='block' id='ysp_download_yy_view_android' style='margin-top:20px'>\
                    <label id='begin_download_label_android'>宿主 Android url：</label><br/>\
                    <input class='input-text' type='text' placeholder='Text' id='download_url_android' >\
                    <button class='btn' id='begin_download_android'>开始下载<br/>\
                         <progress id='begin_download_android_progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
                    </button>\
          </div>\
        </div>"; //<span id='ysp_x_close_download_yy_view' class='icon icon-x'/>

        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_download_yy_parent_view');
        div.innerHTML = html;
        document.getElementById(htmltag).innerHTML = "";
        document.getElementById(htmltag).appendChild(div);

        var btn = document.getElementById('begin_download_ios');
        btn.onclick = function() {
            document.getElementById('begin_download_ios_progress').style.display = 'block';
            var txt = document.getElementById('download_url_ios').value;
                     ProjectConfig.setMasteriOSAppUpdateURL(txt);
            callback("begin_download", txt, function(progress, overed) {
                if (!overed) {
                    document.getElementById("begin_download_ios_progress").value = progress;
                } else {
                    ProjectConfig.setMasterAppUpdated(true);
                    console.info('ios宿主 下载完毕');
                    document.getElementById('begin_download_ios_progress').style.display = 'none';
                }
            });
        }
        var btn1 = document.getElementById('begin_download_android');
        btn1.onclick = function() {
            document.getElementById('begin_download_android_progress').style.display = 'block';
            var txt = document.getElementById('download_url_android').value;
                     ProjectConfig.setMasterAndroidAppUpdateURL(txt);
            callback("begin_download", txt, function(progress, overed) {
                if (!overed) {
                    document.getElementById("begin_download_android_progress").value = progress;
                } else {
                    ProjectConfig.setMasterAppUpdated(true);
                    console.info('android宿主 下载完毕');
                    document.getElementById('begin_download_android_progress').style.display = 'none';
                }
            });
        }

        loadProjectConfig();
    }
}

function loadProjectConfig() {
    var url = ProjectConfig.masterAppUpdateURL();
    // url = 'http://damoreport.bs2cdn.yy.com/C394A491-D8B1-4394-8C1C-DAA9B7661080.zip';
    document.getElementById('download_url_ios').value = ProjectConfig.masteriOSAppUpdateURL();
    document.getElementById('download_url_android').value = ProjectConfig.masterAndroidAppUpdateURL();
    // var isupdate = ProjectConfig.masterAppUpdated();
    // if (isupdate) {
    //     document.getElementById('begin_download_label_ios').innerHTML += '【已下载】';
    //     document.getElementById('begin_download_label_android').innerHTML += '【已下载】';
    // }
}
