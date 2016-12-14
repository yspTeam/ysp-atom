'use babel';
import {TextEditorView,View} from 'atom-space-pen-views';
import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';
import FileUtils from './file-utils.js';

export default class NewProjectView {

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
    // this.editorView.blur(function() {
    //   that.cancel();
    // });

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

    if (!this.isPathValid(resolvedPath)) {
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

    if (!this.isPathValid(resolvedPath)) {
      this.showError('路径为空');
      return false;
    }

    var projectName = path.basename(resolvedPath);

    var xibPath = path.join(resolvedPath, 'res/xib');
    var scriptPath = path.join(resolvedPath, 'script');

    if (!this.createDir(xibPath)) {
      return false;
    }

    if (!this.createDir(scriptPath)) {
      return false;
    }

    let configFilePath = path.join(resolvedPath,'config.json');
    let jsName = projectName + ".js";
    let jsFilePath = path.join(scriptPath, jsName);

    if (!this.createFileAndWriteData(configFilePath, this.configText(projectName))) {
      this.showError('创建config失败');
      return false;
    }

    if (!this.createFileAndWriteData(jsFilePath, this.entryJSText(projectName))) {
      this.showError('创建js失败');
      return false;
    }

    return true;
  }

  createDir(filePath) {
    var resolvedPath = fs.resolveHome(filePath);

    if (!this.isPathValid(resolvedPath)) {
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

  createFile(filePath) {
    return this.createFileAndWriteData(fs.resolveHome(projectPath),'');
  }

  createFileAndWriteData(filePath, text) {
    var resolvedPath = fs.resolveHome(filePath);

    if (!this.isPathValid(resolvedPath)) {
      return false;
    }

    fs.writeFileSync(resolvedPath, text);
    return true;
  }

  isPathValid(pathToCheck) {
    return (pathToCheck != null) && typeof pathToCheck === 'string' && pathToCheck.length > 0;
  }

  configText(name) {
    var text = '{"pluginName":"'+name+'","version":"1.0","openId":"","resourceList":{},"entryJS":"'+name+'.js"}';
    return text
  }

  entryJSText(name) {
    var text = "require('YYApi')\n\ndefineClass(\""+name+":YSPBasePlugin\",{})"
    return text;
  }
}
