'use babel';
import {TextEditorView,View} from 'atom-space-pen-views';
import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';
import FileUtils from './file-utils.js';

export default class NewProject {

  constructor(serializedState) {
    this.panel = null;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('new-project-view');

    this.messageView = document.createElement('div');
    this.messageView.textContent = '请输入工程路径';
    this.messageView.classList.add('message');
    this.element.appendChild(this.messageView);

    var that = this;
    this.editorView = new TextEditorView({mini:true});
    this.editorView.appendTo(this.element);
    this.editorView.blur(function() {
      that.cancel();
    });

    var cancelBtn = document.createElement('input');
    cancelBtn.type = "button";
    cancelBtn.value = '取消';
    cancelBtn.classList.add('cancel');
    cancelBtn.style.display = 'none';

    cancelBtn.onclick = function() {
      that.cancel();
    };

    this.element.appendChild(cancelBtn);

    var confirmBtn = document.createElement('input');
    confirmBtn.classList.add('confirm');
    confirmBtn.value = '确定';
    confirmBtn.type = 'button';
    confirmBtn.style.display = 'none';
    confirmBtn.onclick = function() {
      that.confirm();
    };

    this.element.appendChild(confirmBtn);

    this.errorView = document.createElement('div');
    this.errorView.classList.add('error');
    this.element.appendChild(this.errorView);

    atom.commands.add('atom-workspace', {
            'core:confirm': ::this.confirm,
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

    if (this.validProjectPath(normalizePath)) {
      if (this.createProject(normalizePath)) {
        // open
        atom.open({pathsToOpen: packagePath});
        this.detach();
      }
    }
  }

  attach() {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({
        item: this.getElement(),
        visible: true
      });

      var newProjectPath = this.getNewProjectPath();
      this.editorView.getModel().setText(newProjectPath);
      this.editorView.focus();

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

  createProject(projectPath) {
    var resolvedPath = fs.resolveHome(projectPath);

    if (!FileUtils.isPathValid(resolvedPath)) {
      this.showError('路径为空');
      return false;
    }

    var projectName = path.basename(resolvedPath);
    var iosProjectPath = path.join(resolvedPath, 'ios');
    var androidProjectPath = path.join(resolvedPath, 'android');
    var resPath = path.join(iosProjectPath, 'res');
    var xibPath = path.join(iosProjectPath, 'res/xib');
    var scriptPath = path.join(iosProjectPath, 'script');

    if (!this.createDir(xibPath)) {
      return false;
    }

    if (!this.createDir(scriptPath)) {
      return false;
    }

    if (!this.createDir(androidProjectPath)) {
      return false;
    }

    //项目配置文件
    let projectConfig = path.join(iosProjectPath,'project.json')

    let configFilePath = path.join(iosProjectPath,'config.json');
    let jsName = projectName + ".js";
    let jsFilePath = path.join(scriptPath, jsName);

    let resConfigPath = path.join(resPath,'resConfig.json');

    if (!FileUtils.createFileAndWriteData(projectConfig, this.projectConfigText(projectName))) {
      this.showError('创建projectConfig失败');
      return false;
    }

    if (!FileUtils.createFileAndWriteData(configFilePath, this.pluginConfigText(projectName))) {
      this.showError('创建config失败');
      return false;
    }

    if (!FileUtils.createFileAndWriteData(resConfigPath, '{"resourceList":{}}')) {
      this.showError('创建resConfig失败');
      return false;
    }

    if (!FileUtils.createFileAndWriteData(jsFilePath, this.entryJSText(projectName))) {
      this.showError('创建js失败');
      return false;
    }

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

  projectConfigText(){
    var url = 'http://192.168.1.1/ysp/YYMobile.zip';
    var text = `{"masterAppUrl":"${url}"}`;
    return text;
  }

  pluginConfigText(name) {
    var text = '{"pluginName":"'+name+'","version":"1.0","minYYVersion":"5.9.0","openId":"'+name+'","entryJS":"'+name+'.js","entryClass":"'+name+'"}';
    return text
  }

  entryJSText(name) {
    var text = "require('YYAPI')\nrequire('YSPService')\n\
    \nYYClass('"+name+":YSPBasePlugin', {\n\
    	\n\
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
  onPluginDestroy: function() {\n\
    \n\
  },\n\
    \n\
  onModuleDealloc: function(module) {\n\
    \n\
  }\n})";

    return text;
  }
}
