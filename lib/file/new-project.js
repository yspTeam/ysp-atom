'use babel';
import {
    TextEditorView,
    View
} from 'atom-space-pen-views';
import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';
import FileUtils from './file-utils.js';
import template from './template.js';

export default class NewProject {

    constructor(serializedState) {
        this.panel = null;

        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('new-project-view');

        this.messageView = document.createElement('div');
        this.messageView.textContent = '请输入工程路径';
        this.element.appendChild(this.messageView);

        this.editorView = new TextEditorView({
            mini: true
        });
        this.editorView.appendTo(this.element);

        this.iOSPackgeNameView = document.createElement('div');
        this.iOSPackgeNameView.textContent = '请输入iOS BundleId';
        this.element.appendChild(this.iOSPackgeNameView);

        this.iOSPackageNameEditorView = new TextEditorView({
            mini: true
        });
        this.iOSPackageNameEditorView.appendTo(this.element);

        this.androidPackageNameView = document.createElement('div');
        this.androidPackageNameView.textContent = '请输入android包名';
        this.element.appendChild(this.androidPackageNameView);

        this.androidPackageNameEditorView = new TextEditorView({
            mini: true
        });
        this.androidPackageNameEditorView.appendTo(this.element);

        this.schemeView = document.createElement('div');
        this.schemeView.textContent = '请输入url scheme';
        this.element.appendChild(this.schemeView);

        this.schemeEditorView = new TextEditorView({
            mini: true
        });
        this.schemeEditorView.appendTo(this.element);

        var that = this;

        var cancelBtn = document.createElement('input');
        cancelBtn.type = "button";
        cancelBtn.value = '取消';
        cancelBtn.classList.add('cancel');
        cancelBtn.onclick = function() {
            that.cancel();
        };

        this.element.appendChild(cancelBtn);

        var confirmBtn = document.createElement('input');
        confirmBtn.classList.add('confirm');
        confirmBtn.value = '确定';
        confirmBtn.type = 'button';
        confirmBtn.onclick = function() {
            that.confirm();
        };

        this.element.appendChild(confirmBtn);

        this.errorView = document.createElement('div');
        this.errorView.classList.add('error');
        this.element.appendChild(this.errorView);
        atom.commands.add('atom-workspace', {
            'core:cancel': ::this.detach
        });
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
        this.panel.destroy();
    }

    getElement() {
        return this.element;
    }

    cancel() {
        this.detach();
    }

    confirm() {
        if (this.panel === null) {
            return;
        }

        var packagePath = this.editorView.getText().trim();
        var normalizePath = path.normalize(packagePath);

        let iosPackageName = this.iOSPackageNameEditorView.getText().trim();
        let androidPackageName = this.androidPackageNameEditorView.getText().trim();
        let scheme = this.schemeEditorView.getText().trim();

        if (this.validateInput(normalizePath)) {
            if (this.createProject(normalizePath)) {
                // open
                atom.open({
                    pathsToOpen: packagePath
                });
                this.detach();
            }
        }
    }

    // writeObj(obj){
    //  var description = "";
    //  for(var i in obj){
    //  var property=obj[i];
    //  description+=i+" = "+property+"\n";
    //  }
    //  console.log('obj:'+description);
    // }
    attach() {
        if (!this.panel) {
            this.panel = atom.workspace.addModalPanel({
                item: this.getElement(),
                visible: true
            });

            var newProjectPath = this.getNewProjectPath();
            this.editorView.getModel().setText(newProjectPath);
            this.editorView.focus();

            this.iOSPackageNameEditorView.getModel().setText(atom.config.get('atom-ysp.iosBundleID'));
            this.androidPackageNameEditorView.getModel().setText(atom.config.get('atom-ysp.androidPackageName'));
            this.schemeEditorView.getModel().setText(atom.config.get('atom-ysp.schema'));

            this.hideError();
        }
    }

    detach() {
        if (this.panel === null) {
            return;
        }

        this.panel.destroy();
        this.panel = null;
        atom.workspace.getActivePane().activate();
    }

    getNewProjectPath() {
        return path.join(fs.getHomeDirectory(), 'YSPProject/newProject')
    }

    showError(text) {
        this.errorView.style.display = 'block';
        this.errorView.textContent = text;
    }

    hideError() {
        this.errorView.style.display = 'none';
    }

    validProjectPath(projectPath) {
        var resolvedPath = fs.resolveHome(projectPath);

        if (!FileUtils.isPathValid(resolvedPath)) {
            this.showError('请输入工程路径');
            return false;
        }

        if (fs.existsSync(resolvedPath)) {
            this.showError(resolvedPath + '已存在');
            return false;
        }

        return true;
    }

    validateInput(projectPath) {
        let iosPackageName = this.iOSPackageNameEditorView.getText().trim();
        let androidPackageName = this.androidPackageNameEditorView.getText().trim();
        let scheme = this.schemeEditorView.getText().trim();

        if (this.validProjectPath(projectPath)) {
            if (iosPackageName != null && iosPackageName.length === 0) {
                this.showError('请输入iOS BundleId');
                return false;
            }

            if (androidPackageName != null && androidPackageName.length === 0) {
                this.showError('请输入android包名');
                return false;
            }

            if (scheme != null && scheme.length === 0) {
                this.showError('请输入url scheme');
                return false;
            }

            return true;
        }

        return false;
    }

    createProject(projectPath) {
        var resolvedPath = fs.resolveHome(projectPath);

        if (!FileUtils.isPathValid(resolvedPath)) {
            this.showError('路径为空');
            return false;
        }

        var projectName = path.basename(resolvedPath);
        var iosProjectPath = path.join(resolvedPath, 'ios');
        var androidProjectPath = path.join(resolvedPath, 'android');
        var kiteLinkPath = path.join(resolvedPath, 'kiteLink');
        var weexPath = path.join(resolvedPath, 'weex');

        var resPath = path.join(iosProjectPath, 'res');
        var xibPath = path.join(iosProjectPath, 'res/xib');
        var scriptPath = path.join(iosProjectPath, 'script');

        var eslintrcPath = path.join(resolvedPath, '.eslintrc.js')

        if (!this.createDir(xibPath)) {
            return false;
        }

        if (!this.createDir(scriptPath)) {
            return false;
        }

        if (!this.createDir(androidProjectPath)) {
            return false;
        }

        if (!this.createDir(kiteLinkPath)) {
            return false;
        }

        if (!this.createDir(weexPath)) {
            return false;
        }

        //项目配置文件
        let projectConfig = path.join(resolvedPath, 'project.json')

        let configFilePath = path.join(iosProjectPath, 'config.json');
        let jsName = projectName + ".js";
        let jsFilePath = path.join(scriptPath, jsName);

        let androidOuputPath = path.join(resolvedPath, 'build/cache/android');

        if (!FileUtils.createFileAndWriteData(projectConfig, this.projectConfigText(androidOuputPath))) {
            this.showError('创建projectConfig失败');
            return false;
        }

        if (!FileUtils.createFileAndWriteData(configFilePath, this.pluginConfigText(projectName))) {
            this.showError('创建config失败');
            return false;
        }

        if (!FileUtils.createFileAndWriteData(jsFilePath, this.entryJSText(projectName))) {
            this.showError('创建js失败');
            return false;
        }

        if (!FileUtils.createFileAndWriteData(eslintrcPath, this.eslintrcText())) {
            this.showError('创建.eslintrc.js失败');
            return false;
        }

        // 创建android
        let androidPackageName = this.androidPackageNameEditorView.getText().trim();

        template.createAndroidProject(resolvedPath, androidPackageName);

        return true;
    }

    createDir(filePath) {
        var resolvedPath = fs.resolveHome(filePath);

        if (!FileUtils.isPathValid(resolvedPath)) {
            return false;
        }

        if (fs.existsSync(resolvedPath)) {
            return true;
        }

        try {
            mkdirp.sync(resolvedPath);
            return true;
        } catch (error) {
            this.showError(error);
            return false;
        }

        return true;
    }

    projectConfigText(androidOuputPath) {
        let iosPackageName = this.iOSPackageNameEditorView.getText().trim();
        let androidPackageName = this.androidPackageNameEditorView.getText().trim();
        let scheme = this.schemeEditorView.getText().trim();

        var url = 'http://172.25.40.4/YYMobile.zip';
        var url1 = 'http://172.25.40.4/client-debug.apk';
        var url2 = 'http://172.25.40.4/ysp_1.zip';
        var iosAppFile = 'YYMobile.app';
        var androidAppFile = 'client-debug.apk';

        //因为win地址要放入json中，对\做转译
        var os = require('os');
        var mPlatform = os.platform();
        if (mPlatform == "win32") {
            androidOuputPath = androidOuputPath.replace(new RegExp(/(\\)/g), '\\\\');
        }

        var text = `{"androidAppFileName":"${androidAppFile}",\
    "iosAppFileName":"${iosAppFile}",\
    "androidAppUrl":"${url1}",\
    "iosAppUrl":"${url}",\
    "androidBuildToolsURL":"${url2}",\
    "iosBundleId":"${iosPackageName}",\
    "androidPackageName":"${androidPackageName}",\
    "iosScheme":"${scheme}",\
    "androidScheme":"${scheme}",\
    "android_output_path":"${androidOuputPath}"}`;
        return text;
    }

    pluginConfigText(name) {
        var text = '{"pluginName":"' + name + '","version":"1.0.0","minYYVersion":"5.9.0","openId":"' + name + '","entryJS":"' + name + '.js","entryClass":"' + name + '"}';
        return text
    }

    entryJSText(name) {
        var text = "require('YYAPI')\n\
    \nYYClass('" + name + ":YSPBasePlugin', {\n\
  onPluginInit:function() {\n\n\
  },\n\n\
  onAllPluginDidInit: function() {\n\
    \n\
  },\n\
    \n\
  onModuleViewDidLoad: function(module) {\n\
    \n\
  },\n\
    \n\
  onModuleViewDidAppear: function(module) {\n\
    \n\
  },\n\
    \n\
  onDeviceOrientationDidChange: function(orientation) {\n\
    \n\
  },\n\
    \n\
  onModuleDealloc: function(module) {\n\
    \n\
  },\n\
  \n\
  onPluginDestroy: function() {\n\
    \n\
  }\n\
})";

        return text;
    }

    eslintrcText() {
        text = '\n\
    module.exports = {\n\
        "env": {\n\
            "browser": true,\n\
            "commonjs": true,\n\
            "es6": true\n\
        },\n\
        "extends": "eslint:recommended",\n\
        "parserOptions": {\n\
            "ecmaFeatures": {\n\
                "jsx": true\n\
            },\n\
            "sourceType": "module",\n\
            "ecmaVersion": "6"\n\
        },\n\
        "rules": {\n\
            "linebreak-style": [\n\
                "error",\n\
                "unix"\n\
            ],\n\
            "semi": "off",\n\
            "no-undef": "off",\n\
            "no-unused-vars": "warn",\n\
            "no-console": "off",\n\
            "no-mixed-spaces-and-tabs": 0\
        }\n\
    };'
        return text;
    }
}
