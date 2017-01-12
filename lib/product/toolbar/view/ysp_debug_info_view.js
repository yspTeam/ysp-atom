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
             <div style='float:left;widht:49%;'>\
                    <label>iOS Scheme：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='demo://' id='ysp_setting_ios_scheme' ><br/>\
                    <label>iOS App File Name：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='xx.app' id='ysp_setting_ios_appfile' ><br/>\
                    <label>iOS Bundle Identifier：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='com.demo' id='ysp_setting_iosid' ><br/>\
             </div>\
             <div style='float:left;widht:49%;margin-left:40px'>\
                    <label>Android Scheme：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='demo://' id='ysp_setting_android_scheme' ><br/>\
                    <label>Android App File Name：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='xx.app' id='ysp_setting_android_appfile' ><br/>\
                    <label>Android package：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='com.demo' id='ysp_setting_androidid' ><br/>\
             </div>\
        \
          <div class='block' id='ysp_debug_info_view'  style='margin-top:200px;position:absolute'>\
          <label class='input-label'><input class='input-toggle' type='checkbox' checked style='width:32px;'>开启快速调试</label>\
          </div>\
          \
          <button class='btn' id='ysp_debug_info_save'  style='margin-top:250px;position:absolute'>保存</button>\
        </div>";
        //<input class='input-text' type='text' placeholder='Text'>
        var div = document.createElement("div");
        div.setAttribute('id', 'ysp_debug_info_parent_view');
        div.innerHTML = html;
        document.getElementById(htmltag).innerHTML = "";
        document.getElementById(htmltag).appendChild(div);

        var btn = document.getElementById('ysp_debug_info_save');
        btn.onclick = function() {
            saveProjectConfig();
        }

        loadProjectConfig();
    }
}

function saveProjectConfig() {

        ProjectConfig.setIosBundleId(document.getElementById('ysp_setting_iosid').value);
        ProjectConfig.setIosAppFileName(document.getElementById('ysp_setting_ios_appfile').value);
        ProjectConfig.setIosScheme(document.getElementById('ysp_setting_ios_scheme').value);
3
    ProjectConfig.setAndroidPackage(document.getElementById('ysp_setting_androidid').value);
       ProjectConfig.setAndroidAppFileName(document.getElementById('ysp_setting_android_appfile').value);
       ProjectConfig.setAndroidScheme(document.getElementById('ysp_setting_android_scheme').value);
}

function loadProjectConfig() {
    document.getElementById('ysp_setting_iosid').value = ProjectConfig.iosBundleId();
        document.getElementById('ysp_setting_ios_appfile').value = ProjectConfig.iosAppFileName();
        document.getElementById('ysp_setting_ios_scheme').value = ProjectConfig.iosScheme();

    document.getElementById('ysp_setting_androidid').value = ProjectConfig.androidPackage();
       document.getElementById('ysp_setting_android_appfile').value = ProjectConfig.androidAppFileName();
    document.getElementById('ysp_setting_android_scheme').value = ProjectConfig.androidScheme();
}
