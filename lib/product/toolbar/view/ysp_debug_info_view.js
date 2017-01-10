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
        <label>宿主Scheme：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='demo://' id='ysp_setting_scheme' ><br/>\
        <label>iOS Bundle Identifier：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='com.demo' id='ysp_setting_iosid' ><br/>\
        <label>Android package：</label><input class='input-text ysp_debug_info_input' type='text' placeholder='com.demo' id='ysp_setting_androidid' ><br/>\
        \
          <div class='block' id='ysp_debug_info_view'  style='margin-top:20px'>\
          <label class='input-label'><input class='input-toggle' type='checkbox' checked style='width:32px;'>开启快速调试</label>\
          </div>\
          \
          <button class='btn' id='ysp_debug_info_save'>保存</button>\
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
    var scheme = document.getElementById('ysp_setting_scheme').value;
    ProjectConfig.setScheme(scheme);
    var iosid = document.getElementById('ysp_setting_iosid').value;
    ProjectConfig.setIosBundleId(iosid);
    var androidid = document.getElementById('ysp_setting_androidid').value;
    ProjectConfig.setAndroidPackageName(androidid);
}

function loadProjectConfig() {
    document.getElementById('ysp_setting_iosid').value = ProjectConfig.iosBundleId();
    document.getElementById('ysp_setting_androidid').value = ProjectConfig.androidPackageName();
    document.getElementById('ysp_setting_scheme').value = ProjectConfig.scheme();
}
