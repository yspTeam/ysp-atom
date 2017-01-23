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
             <div style='float:left;'>\
                    <label>iOS Scheme：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_ios_scheme' ></atom-text-editor><br/>\
                    <label>iOS App File Name：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_ios_appfile' ></atom-text-editor><br/>\
                    <label>iOS Bundle Identifier：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_iosid' ></atom-text-editor><br/>\
             </div>\
             <div style='float:left;margin-left:40px'>\
                    <label>Android Scheme：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_android_scheme' ></atom-text-editor><br/>\
                    <label>Android App File Name：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_android_appfile' ></atom-text-editor><br/>\
                    <label>Android package：</label><atom-text-editor class='editor mini'tabindex='-1' mini='' data-grammar='text plain null-grammar' data-encoding='utf8' id='ysp_setting_androidid' ></atom-text-editor><br/>\
             </div>\
          \
          <div class='block' id='ysp_debug_info_view'  style='margin-top:210px;position:absolute'>\
          <label class='input-label'><input id='ysp_debug_quick_debug' class='input-toggle' type='checkbox' checked style='width:32px;'>开启快速调试</label>\
          </div>\
          \
          <div class='block' id='ysp_debug_info_view'  style='margin-top:240px;position:absolute'>\
          <label class='input-label'><input id='ysp_debug_run_ios' class='input-checkbox' type='checkbox' checked style='width:16px;'>仅调试iOS</label>\
          <label class='input-label'><input id='ysp_debug_run_android' class='input-checkbox' type='checkbox' checked style='width:16px;'>仅调试Android</label>\
          </div>\
          \
          <button class='btn' id='ysp_debug_info_save'  style='margin-top:280px;position:absolute'>保存</button>\
        </div>";

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

        ProjectConfig.setIosBundleId(document.getElementById('ysp_setting_iosid').getModel().getText().trim());
        ProjectConfig.setIosAppFileName(document.getElementById('ysp_setting_ios_appfile').getModel().getText().trim());
        ProjectConfig.setIosScheme(document.getElementById('ysp_setting_ios_scheme').getModel().getText().trim());

        ProjectConfig.setAndroidPackage(document.getElementById('ysp_setting_androidid').getModel().getText().trim());
        ProjectConfig.setAndroidAppFileName(document.getElementById('ysp_setting_android_appfile').getModel().getText().trim());
        ProjectConfig.setAndroidScheme(document.getElementById('ysp_setting_android_scheme').getModel().getText().trim());

        ProjectConfig.setQuickDebug(document.getElementById('ysp_debug_quick_debug').checked);

        ProjectConfig.setIsRuniOS(document.getElementById('ysp_debug_run_ios').checked);
        ProjectConfig.setIsRunAndroid(document.getElementById('ysp_debug_run_android').checked);
}

function loadProjectConfig() {

        document.getElementById('ysp_setting_iosid').getModel().setText(textPreCheck(ProjectConfig.iosBundleId()));
        document.getElementById('ysp_setting_ios_appfile').getModel().setText(textPreCheck(ProjectConfig.iosAppFileName()));
        document.getElementById('ysp_setting_ios_scheme').getModel().setText(textPreCheck(ProjectConfig.iosScheme()));

        document.getElementById('ysp_setting_androidid').getModel().setText(textPreCheck(ProjectConfig.androidPackage()));
        document.getElementById('ysp_setting_android_appfile').getModel().setText(textPreCheck(ProjectConfig.androidAppFileName()));
        document.getElementById('ysp_setting_android_scheme').getModel().setText(textPreCheck(ProjectConfig.androidScheme()));

        document.getElementById('ysp_debug_quick_debug').checked = ProjectConfig.quickDebug();

        document.getElementById('ysp_debug_run_ios').checked = ProjectConfig.isRuniOS();
        document.getElementById('ysp_debug_run_android').checked = ProjectConfig.isRunAndroid();
}

function textPreCheck(t) {
          if (t == null) { return ""; }
          if (t == "undefine") { return ""; }
          return t;
}
