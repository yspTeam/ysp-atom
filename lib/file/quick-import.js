'use babel';

import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory} from 'atom';
import ProjectConfig from './../project-config';

var chokidar = require('chokidar');


export default class QuickImport {

  constructor(serializedState) {
    this.keyStrings = ['NS','UI','CA','AV','YYAPI'];
    this.listenDirs = [];
    this.listenFiles = [];
    this.class2script = {};
    this.chokidarListen(this.scriptPath());

    console.log('url:'+ProjectConfig.masterAppUpdateURL());
  }

  chokidarListen(scriptDir){
    if (scriptDir == null) {
      return;
    }
    var self = this;

    var watcher = chokidar.watch(scriptDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.add(path.join(scriptDir,'**/*.js'));

    watcher
    .on('add', path => {
      self.scanScriptFile(path);
      // console.log(`File ${path} has been added`)
    });
  }

  import(){

    var editor = atom.workspace.getActiveTextEditor();
    var word = editor.getSelectedText();
    if (word == '') {
        word = editor.getWordUnderCursor()
    }
    console.log('word',word);
    word = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    var requireString = '';

    for (var i = 0; i < this.keyStrings.length; i++) {
      let keyword = this.keyStrings[i];
      if (word.includes(keyword)) {
        requireString = `require('${word}')`
        break;
      }else{
        //自定义类
      }
    }
    //去重判断
    var repeat = this.checkRepeatRequire(requireString);
    if (!repeat) {
      //移动到首行
      editor.moveToTop();
      editor.moveDown();
      editor.insertNewlineAbove();
      editor.insertText(requireString);
    }
  }

  //去重
  checkRepeatRequire(requireString){
    let repeat = false;
    var editor = atom.workspace.getActiveTextEditor();
    //TextEditor的scan函数，callback是一个同步的调用，非异步。跟nodejs不一样
    editor.scan(/require\('([\w\W]+?)'\)/g, function(result) {
      if (requireString == result.matchText) {
        // console.log('equ',requireString,result.matchText);
        repeat = true
        result.stop();
      }
    });
    return repeat;
  }


  scanScriptFile(filePath){

    if (path.extname(filePath)==='.js') {

      console.log('扫描',filePath);
      var scriptContent = fs.readFileSync(filePath);
      var scriptString = scriptContent.toString();

      var found = scriptString.match(/YYClass\("([\w\W]+?)\"/);

      if (found && found.hasOwnProperty(1)) {
          var yyclass = found[1];
          // this.class2script[yyclass] = path.relative();
      }

    }

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
    console.log('listen script dirs', filePath);

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

        let self = this;
        dir.onDidChange(function() {
          // that.reloadConfig();
          self.listenScriptDirChange(filePath);
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
