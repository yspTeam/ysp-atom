'use babel';
import {TextEditorView} from 'atom-space-pen-views';
import fs from 'fs-plus';
import path from 'path';
import FileUtils from './file-utils.js';

export default class NewFile {

  constructor(serializedState) {
    this.panel = null;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('new-file-view');

    this.messageView = document.createElement('div');
    this.messageView.textContent = '请输入文件路径';
    this.messageView.classList.add('message');
    this.element.appendChild(this.messageView);

    var that = this;
    this.editorView = new TextEditorView({mini:true});
    this.editorView.appendTo(this.element);
    this.editorView.blur(function() {
        that.detach();
    });

    this.errorView = document.createElement('div');
    this.errorView.classList.add('error');
    this.element.appendChild(this.errorView);

    atom.commands.add('atom-workspace', {
            'core:confirm': ::this.confirm,
            'core:cancel': ::this.detach
          })
  }

  confirm() {
    if (this.panel === null) {
      return;
    }

    this.createNewFile();
  }

  attach() {
    if (!this.panel) {
      this.panel = atom.workspace.addModalPanel({
        item: this.getElement(),
        visible: true
      });

      this.editorView.getModel().setText('script/');
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

  getElement() {
    return this.element;
  }

  createNewFile() {
    var packagePath = this.editorView.getText().trim();
    var normalizePath = path.normalize(packagePath);
    var resolvedPath = fs.resolveHome(normalizePath);
    var fullPath = path.join(FileUtils.rootPath(), resolvedPath);

    if (this.validProjectPath(fullPath)) {
      // 取文件名不带后缀
      var fileName = FileUtils.fileNameWithoutExt(fullPath);
      var jsFileText = this.jsFileText(fileName);
      FileUtils.createFileAndWriteData(fullPath, jsFileText);
      atom.workspace.open(fullPath);
      this.detach();
    }
  }

  validProjectPath(projectPath) {
    var resolvedPath = fs.resolveHome(projectPath);

    if (!FileUtils.isPathValid(resolvedPath)) {
      this.showError('请输入工程路径');
      return false;
    }

    if (resolvedPath.endsWith('/')) {
      this.showError('文件名不能以/结尾');
      return false;
    }

    if (fs.existsSync(resolvedPath)) {
      this.showError(resolvedPath + '已存在');
      return false;
    }

    return true;
  }

  showError(text) {
    this.errorView.style.display = 'block';
    this.errorView.textContent = text;
  }

  hideError() {
    this.errorView.style.display = 'none';
  }

  jsFileText(name) {
    var text = "require('YYApi')\n\ndefineClass(\""+name+"\",{})"
    return text;
  }
}
