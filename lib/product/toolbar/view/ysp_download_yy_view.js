'use babel';
import mkdirp from 'mkdirp';
import ProjectConfig from './../../../project-config.js';
import YSPHttpDownloader from './../../http_downloader';

export default class YSPSettingDownloadView {

      downloader: null;
    android_tools_unzip_path: null;

    constructor(serializedState) {
        //初始化下载类
        downloader = new YSPHttpDownloader();

        var path = require('path');
        var child = require('child_process');
        var exec = child.exec;

        android_tools_unzip_path = path.join(require('./../../common').rootPath(), 'build/build_config/android/');
        mkdirp.sync(android_tools_unzip_path);
    }

    show(htmltag) {
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
            download({
                "url": txt,
                "downloadPath": null,
                "unzipPath": null
            }, function(progress, overed) {
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
            var txt = document.getElementById('download_url_android').getModel().getText().trim();
            ProjectConfig.setMasterAndroidAppUpdateURL(txt);
            download({
                "url": txt,
                "downloadPath": downloader.getUnZipPath(),
                "unzipPath": null
            }, function(progress, overed) {
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
            download({
                "url": txt,
                "downloadPath": null,
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

 function download(data, complate) {
            var url = data.url;
            var downloadPath = data.downloadPath;
            var unzipPath = data.unzipPath;
            require('./../../common').emitter().emit('ysp_toolbar_setProgress', true, 'downloading', 0);
            downloader.download(url, downloadPath, unzipPath, function(progress, over) {
                require('./../../common').emitter().emit('ysp_toolbar_setProgress', !over, 'downloading', progress);
                complate(progress, over);
            });
}

function loadProjectConfig() {
    try {
        document.getElementById('download_url_ios').getModel().setText(textPreCheck(ProjectConfig.masteriOSAppUpdateURL()));
        document.getElementById('download_url_android').getModel().setText(textPreCheck(ProjectConfig.masterAndroidAppUpdateURL()));
        document.getElementById('download_url_android_tools').getModel().setText(textPreCheck(ProjectConfig.androidBuildToolsURL()));
    } catch (e) {
        console.error(e);
    } finally {
    }
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
