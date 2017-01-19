'use babel';

import ProjectConfig from './../../../project-config.js';

export default class YSPSettingDownloadView {

    android_tools_unzip_path: null;
    constructor(serializedState) {
        var path = require('path');
        var child = require('child_process');
        var exec = child.exec;

        android_tools_unzip_path = path.join(require('./../../common').rootPath(), 'build/build_config/android/');
        try {
            var mkdir = 'mkdir -p ' + android_tools_unzip_path;
            var child = exec(mkdir, function(err, stdout, stderr) {
                if (err) throw err;
            });
        } catch (e) {
            alert('创建cache目录失败：' + e);
        } finally {

        }
    }

    show(htmltag, callback) {
        if (document.getElementById("ysp_download_yy_parent_view") != null) {
            document.getElementById("ysp_download_yy_parent_view").remove();
        }
        var body = document.body;
        var html = "\
        <div id='ysp_download_yy_view_bg' style='margin-top:10px'>\
          <div class='block'>\
                    <label id='begin_download_label_ios'>宿主 iOS Url</label><br/>\
                    <atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='download_url_ios' /></atom-text-editor>\
                    <button class='btn' id='begin_download_ios'>开始下载<br/>\
                         <progress id='begin_download_ios_progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
                    </button>\
          </div>\
          <div class='block' style='margin-top:20px'>\
                    <label id='begin_download_label_android'>宿主 Android Url</label><br/>\
                    <atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='download_url_android' ></atom-text-editor>\
                    <button class='btn' id='begin_download_android'>开始下载<br/>\
                         <progress id='begin_download_android_progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
                    </button>\
          </div>\
          <div class='block' style='margin-top:100px'>\
                    <label>Android Build Tools Url：</label><br/>\
                    <atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='download_url_android_tools' ></atom-text-editor>\
                    <button class='btn' id='begin_download_android_tools'>开始下载<br/>\
                         <progress id='begin_download_android_tools_progress' class='inline-block' max='1' value='0' style='display:none;width:100%'></progress>\
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
            var txt = document.getElementById('download_url_ios').getModel().getText().trim();
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
            var txt = document.getElementById('download_url_android_tools').getModel().getText().trim();
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
        var btn2 = document.getElementById('begin_download_android_tools');
        btn2.onclick = function() {
            document.getElementById('begin_download_android_tools_progress').style.display = 'block';
            var txt = document.getElementById('download_url_android_tools').getModel().getText().trim();
            ProjectConfig.setAndroidBuildToolsURL(txt);
            callback("begin_download_with_unzippath", {
                "url": txt,
                "unzipPath": android_tools_unzip_path
            }, function(progress, overed) {
                if (!overed) {
                    document.getElementById("begin_download_android_tools_progress").value = progress;
                } else {
                    console.info('android Build Tools 下载完毕');
                    document.getElementById('begin_download_android_tools_progress').style.display = 'none';
                }
            });
        }

        loadProjectConfig();
    }
}

function loadProjectConfig() {
    // url = 'http://damoreport.bs2cdn.yy.com/C394A491-D8B1-4394-8C1C-DAA9B7661080.zip';
    try {
        document.getElementById('download_url_ios').getModel().setText(textPreCheck(ProjectConfig.masteriOSAppUpdateURL()));
        document.getElementById('download_url_android').getModel().setText(textPreCheck(ProjectConfig.masterAndroidAppUpdateURL()));
        document.getElementById('download_url_android_tools').getModel().setText(textPreCheck(ProjectConfig.androidBuildToolsURL()));
    } catch (e) {
        console.error(e);
    } finally {
    }

    // var isupdate = ProjectConfig.masterAppUpdated();
    // if (isupdate) {
    //     document.getElementById('begin_download_label_ios').innerHTML += '【已下载】';
    //     document.getElementById('begin_download_label_android').innerHTML += '【已下载】';
    // }
}

function textPreCheck(t) {
    if (t == null) {
        return "";
    }
    if (t == "undefine") {
        return "";
    }
    return t;
}
