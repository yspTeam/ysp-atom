'use babel';

import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory} from 'atom';

export default class QuickImport {

  constructor(serializedState) {
    this.keyStrings = ['NS','UI','CA','AV'];
    this.listenDirs = [];
    this.class2script = {};

    this.listenScriptDirChange(this.scriptPath());
  }

  import(){

    var editor = atom.workspace.getActiveTextEditor();
    var word = editor.getSelectedText();
    if (word == '') {
        word = editor.getWordUnderCursor()
    }
    word = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    var requireString = '';

    for (var i = 0; i < this.keyStrings.length; i++) {
      let keyword = this.keyStrings[i];
      if (word.includes(keyword)) {
        requireString = `require('${word}')`
        break;
      }
    }

    // UIView
    //移动到首行
    editor.moveToTop();
    editor.moveDown();
    editor.insertNewlineAbove();
    editor.insertText(requireString);
  }

  scanDefineClass(filePath){
    console.log('扫描',filePath);
  }

  scriptPath() {
    var iosProjectPath = FileUtils.iosProjectPath();
    if (FileUtils.isPathValid(iosProjectPath)) {
      return path.join(iosProjectPath, 'script');
    }

    return null
  }

  // 监听文件夹变化
  listenScriptDirChange(filePath) {
    if (!FileUtils.isPathValid(filePath)) {
      return;
    }

    if (!fs.existsSync(filePath)) {
      return;
    }

    if (fs.isDirectorySync(filePath)) {
      if (!this.listenDirs.includes(filePath)) {
        this.listenDirs.push(filePath);

        var dir = new Directory(filePath);
        console.log('listen dir', filePath);

        var that = this;
        dir.onDidChange(function() {
          // that.reloadConfig();
          this.scanDefineClass();
        });
      }

      var subFiles = fs.listSync(filePath);

      if (subFiles && subFiles.length > 0) {
        for (var i = 0; i < subFiles.length; i++) {
            var subFilePath = subFiles[i];
            if (fs.isDirectorySync(subFilePath)) {
              this.listenScriptDirChange(subFilePath);
            }else{
              this.scanDefineClass(subFilePath);
            }

          }
        }
    }
  }

}
