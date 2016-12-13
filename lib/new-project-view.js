'use babel';
import {TextEditorView,View} from 'atom-space-pen-views';
import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';

export default class NewProjectView {

  constructor(serializedState) {
    this.panel = null;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('new-project-view');

    this.messageView = document.createElement('div');
    this.messageView.textContent = '输入路径';
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
    this.errorView.visible = false;
    this.errorView.classList.add('error');
    this.element.appendChild(this.errorView);

    atom.commands.add('.yy-script', {
      'core:confirm': ::this.confirm,
      'core:cancel': ::this.cancel
    })
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

    if (this.validProjectPath(packagePath)) {
      if (this.createProject(packagePath)) {
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
    console.log('errorView', this.errorView);
    this.errorView.visible = true;
    this.errorView.textContent = text;
  }

  hideError() {
    this.errorView.visible = false;
  }

  validProjectPath(projectPath) {
    if (!this.isPathValid(projectPath)) {
      this.showError('请输入路径');
      return false;
    }

    if (fs.existsSync(projectPath)) {
      this.showError(projectPath + '路径已存在');
      return false;
    }

    return true;
  }

  createProject(projectPath) {
    if (!this.isPathValid(projectPath)) {
      this.showError('路径为空');
      return false;
    }

    var resolvedPath = fs.resolveHome(projectPath);
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
    if (!this.isPathValid(filePath)) {
      return false;
    }

    try {
      mkdirp.sync(filePath);
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }

    return true;
  }

  createFile(filePath) {
    if (!this.isPathValid(filePath)) {
      return false;
    }

    var dir = path.dirname(filePath);

    if (!fs.existSync(dir) || !fs.statSync(dir)) {
      mkdirp.sync(dir);
    }

    touch(filePath);

    return true;
  }

  createFileAndWriteData(filePath, text) {
    if (!this.isPathValid(filePath)) {
      return false;
    }

    fs.writeFileSync(filePath, text);
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
